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
// FAILS THE BUILD if Chromium is missing, on purpose.
//
// This used to skip silently, and that is exactly how production ended up
// serving the homepage <title> for /modalidade and /calendario for weeks:
// prerendering worked locally, the Cloudflare Pages build container has no
// Chromium, the step skipped with a warning nobody reads, and the deploy
// shipped a plain SPA. All the per-page meta and JSON-LD became invisible to
// crawlers that do not run JavaScript.
//
// Cloudflare Pages build command has to install it first:
//
//     npx playwright install chromium && npm run build
//
// To deliberately ship without prerendering, set PRERENDER_OPTIONAL=1.

import { createServer, preview } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const SITE_URL = 'https://hoqueiclubepdl.com';
const STATIC_ROUTES = ['/', '/blog', '/modalidade', '/patrocinadores', '/comunicados', '/calendario', '/merch'];

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
  if (route === '/merch') return { priority: '0.8', changefreq: 'monthly' };
  if (route.startsWith('/comunicados/')) return { priority: '0.7', changefreq: 'monthly' };
  if (route.startsWith('/blog/')) return { priority: '0.7', changefreq: 'monthly' };
  return { priority: '0.5', changefreq: 'monthly' };
}

// Cloudflare Pages serves dist/<rota>/index.html em "/<rota>/" e faz 308 da
// forma sem barra. O sitemap tem de listar o URL que responde 200 — senão cada
// entrada é um redirect e o canonical da página não bate certo com o URL por
// onde foi alcançada.
function canonicalPath(route) {
  return route === '/' ? '/' : `${route}/`;
}

async function writeSitemap(routes) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const urls = routes.map((route) => {
    const { priority, changefreq } = getSitemapMeta(route);
    return [
      '  <url>',
      `    <loc>${SITE_URL}${canonicalPath(route)}</loc>`,
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
  } catch (err) {
    const message = [
      '',
      '  Chromium indisponível — as rotas NÃO foram pré-renderizadas.',
      '',
      '  Sem este passo, /modalidade, /calendario, /blog/* e /comunicados/* servem',
      '  todos o <title> e a meta description da homepage, e os crawlers de IA',
      '  (GPTBot, PerplexityBot, ClaudeBot) não veem nenhum dos schemas — não',
      '  executam JavaScript.',
      '',
      '  Corrige com:   npx playwright install chromium',
      '  No Cloudflare Pages, build command:',
      '                 npx playwright install chromium && npm run build',
      '',
      `  Causa: ${err instanceof Error ? err.message.split('\n')[0] : String(err)}`,
      '',
    ].join('\n');

    if (process.env.PRERENDER_OPTIONAL === '1') {
      console.warn(`[prerender] AVISO${message}`);
      return;
    }
    console.error(`[prerender] ERRO${message}`);
    process.exit(1);
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
