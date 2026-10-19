# Deployment

## Desenvolvimento local

```bash
npm run dev        # Inicia em http://localhost:8081 (8080 ocupada no ambiente local)
npm run lint       # ESLint — correr antes de commit
```

## Build de produção

```bash
npm run build      # TypeScript + Vite build, depois scripts/prerender.js → output em dist/
npm run preview    # Preview do build estático em localhost
```

`npm run build` corre `vite build` e depois `scripts/prerender.js`, que:
- grava `dist/sitemap.xml` (rotas tiradas de `blogPosts[]`/`comunicados[]` + `STATIC_ROUTES` do script)
- grava os calendários para subscrever `dist/calendario/{seniores,sub-17,sub-13,sub-11,mini-hoquei}.ics` (de `games[]`, via `src/lib/ics.ts`)
- abre cada rota num Chromium real e grava o HTML final em `dist/<rota>/index.html` (SEO — ver `docs/ARCHITECTURE.md`)

**Setup obrigatório** (local e Cloudflare Pages):
```bash
npx playwright install chromium
```
Sem isto o build **falha** (exit 1, `[prerender] ERRO — Chromium indisponível`) desde 2026-08-11 — antes saltava em silêncio e publicava um SPA sem pré-render. Escape hatch consciente: `PRERENDER_OPTIONAL=1`. O Chromium fica em `~/Library/Caches/ms-playwright/` com a versão presa à do Playwright (ex.: `chromium_headless_shell-1228`): depois de actualizar o Playwright, ou se a cache for limpa, o build local volta a falhar até correr o comando outra vez.

## Variáveis de ambiente

Actualmente **não existem** variáveis de ambiente. Todos os dados são estáticos (`src/data/`).

Se no futuro forem necessárias, criar `.env` com prefixo `VITE_` (Vite expõe só estas ao browser):
```
VITE_API_URL=https://...
```

## Hosting

SPA (Single Page Application) — o servidor de hosting deve:
- Servir `dist/` como root estático
- Ter fallback/rewrite de todos os paths para `index.html` (para React Router funcionar)

Isto continua válido com a pré-renderização activa: `dist/<rota>/index.html` só existe para as rotas conhecidas no momento do build (ficheiro real, servido directamente, sem fallback); qualquer path desconhecido continua a cair no fallback SPA normal.

Exemplos de configuração:
- **Netlify**: `_redirects` com `/* /index.html 200`
- **Vercel**: `vercel.json` com `rewrites`
- **Apache**: `.htaccess` com `RewriteRule`

## Assets

Todos os assets em `public/uploads/` são copiados para `dist/uploads/` no build.
Não é necessário CDN actualmente — tudo servido do mesmo domínio.

## Service Worker (PWA)

`public/sw.js` — activo. Rever estratégia de cache em cada nova época (assets de jogadores mudam).

## Checklist antes de deploy

- [ ] `npm run build` sem erros TypeScript ou Vite
- [ ] `npm run lint` sem erros ESLint
- [ ] Testar dark/light mode em todas as páginas (`/`, `/blog`, `/blog/beneficios-hoquei-em-patins`, `/modalidade`, `/patrocinadores`, `/calendario`, `/merch`, `/pagamentos`)
- [ ] Verificar logo visível em navbar (ambos os modos)
- [ ] Testar responsividade: 390px, 768px, 1440px
- [ ] Confirmar `public/manifest.json` e favicon actualizados
- [ ] Verificar que não existem ficheiros de teste em `public/` (index2.html, etc.)
- [ ] Confirmar `dist/sitemap.xml` e `dist/<rota>/index.html` gerados (log `[prerender] N rotas pré-renderizadas.` no fim do build — se falhar com "Chromium indisponível", correr `npx playwright install chromium`). Ao encadear comandos, não meter o build num pipe (`npm run build | tail`): o pipe devolve o exit code do `tail` e esconde a falha
- [ ] Página nova? Confirmar que define title/description/canonical/og:* via Helmet (ver `docs/CONVENTIONS.md`) e que rotas estáticas novas foram adicionadas a `STATIC_ROUTES` em `scripts/prerender.js`
