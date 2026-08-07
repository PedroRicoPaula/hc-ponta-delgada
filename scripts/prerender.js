// Runs after `vite build`. Snapshots every real route with a real browser
// (Playwright) so crawlers and link-preview bots (which don't run JS) see the
// correct per-page <title>/meta/canonical/content instead of the homepage's,
// which is all a plain SPA can ever serve for /modalidade, /blog/:slug, etc.
// Also generates dist/sitemap.xml from the same route list, so it can never
// drift from the actual data (blogPosts[]/comunicados[]).
//
// Route list comes straight from the site's own data files via Vite's
// ssrLoadModule — no hand-maintained route array to fall out of sync.
//
// Never fails the build: if Chromium isn't installed (`npx playwright install
// chromium`), this step is skipped with a warning and `vite build`'s normal
// SPA output still ships.

import { createServer, preview } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const SITE_URL = 'https://hoqueiclubepdl.com';
const STATIC_ROUTES = ['/', '/blog', '/modalidade', '/patrocinadores', '/comunicados', '/calendario'];

async function getRoutes() {
  const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { blogPosts } = await vite.ssrLoadModule('/src/data/blogData.ts');
    const { comunicados } = await vite.ssrLoadModule('/src/data/siteData.ts');
    return [
      ...STATIC_ROUTES,
      ...blogPosts.map((p) => `/blog/${p.slug}`),
      ...comunicados.map((c) => `/comunicados/${c.slug}`),
    ];
  } finally {
    await vite.close();
  }
}

// Priority and changefreq per route type
function getSitemapMeta(route) {
  if (route === '/') return { priority: '1.0', changefreq: 'weekly' };
  if (route === '/modalidade') return { priority: '0.9', changefreq: 'monthly' };
  if (route === '/calendario') return { priority: '0.9', changefreq: 'daily' };
  if (route === '/comunicados') return { priority: '0.8', changefreq: 'weekly' };
  if (route === '/blog') return { priority: '0.8', changefreq: 'weekly' };
  if (route === '/patrocinadores') return { priority: '0.7', changefreq: 'monthly' };
  if (route.startsWith('/comunicados/')) return { priority: '0.7', changefreq: 'monthly' };
  if (route.startsWith('/blog/')) return { priority: '0.7', changefreq: 'monthly' };
  return { priority: '0.5', changefreq: 'monthly' };
}

async function writeSitemap(routes) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const urls = routes.map((route) => {
    const { priority, changefreq } = getSitemapMeta(route);
    return [
      '  <url>',
      `    <loc>${SITE_URL}${route}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n');
  }).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  await writeFile(path.join(root, 'dist', 'sitemap.xml'), xml, 'utf-8');
}

async function main() {
  const routes = await getRoutes();
  await writeSitemap(routes);
  console.log(`[prerender] sitemap.xml gerado com ${routes.length} rotas`);

  let browser;
  try {
    const { chromium } = await import('playwright');
    browser = await chromium.launch();
  } catch {
    console.warn('[prerender] Chromium indisponível — pré-renderização de HTML por rota saltada.');
    console.warn('[prerender] Corre `npx playwright install chromium` para ativar. Sitemap já foi gerado.');
    return;
  }

  const previewServer = await preview({ root, preview: { port: 4173, strictPort: false } });
  const base = previewServer.resolvedUrls.local[0];

  const page = await browser.newPage();
  for (const route of routes) {
    const url = new URL(route, base).toString();
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(200); // small buffer past networkidle for Helmet/effects to settle
    const html = await page.content();

    const outDir = route === '/' ? path.join(root, 'dist') : path.join(root, 'dist', route.slice(1));
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, 'index.html'), html, 'utf-8');
    console.log(`[prerender] ${route} → ${path.relative(root, outDir)}/index.html`);
  }

  await browser.close();
  await new Promise((resolve) => previewServer.httpServer.close(resolve));
  console.log(`[prerender] ${routes.length} rotas pré-renderizadas.`);
}

main().catch((err) => {
  console.error('[prerender] falhou:', err);
  process.exitCode = 1;
});
