# HC PDL — Hóquei Clube PDL

Site institucional do [Hóquei Clube PDL](https://hoqueiclubepdl.com), clube de hóquei em patins fundado em 2012 em Ponta Delgada, Açores (Portugal). Único clube de hóquei em patins da ilha de São Miguel, com equipa sénior e escalões de formação (Sub-11, Sub-13, Sub-17) a competir no Campeonato Nacional da 3ª Divisão da Federação de Patinagem de Portugal (FPP).

**Site em produção**: https://hoqueiclubepdl.com

## Stack

- [React 18](https://react.dev) + [TypeScript 5.5](https://www.typescriptlang.org) + [Vite 6](https://vitejs.dev)
- [Tailwind CSS 3.4](https://tailwindcss.com) — dark mode via classe (`darkMode: ["class"]`)
- [shadcn/ui](https://ui.shadcn.com) (Radix UI) — componentes base em `src/components/ui/`
- [framer-motion](https://www.framer.com/motion/) — animações e transições
- [next-themes](https://github.com/pacocoursey/next-themes) — gestão de tema claro/escuro
- [React Router v6](https://reactrouter.com) — routing client-side
- [@tanstack/react-query](https://tanstack.com/query) — data fetching
- [react-helmet-async](https://github.com/staylor/react-helmet-async) — meta tags e SEO por página
- [Playwright](https://playwright.dev) — pré-renderização estática e testes visuais

## Desenvolvimento

Requisitos: [Node.js](https://nodejs.org) 18+ e npm.

```sh
git clone https://github.com/PedroRicoPaula/hc-ponta-delgada.git
cd hc-ponta-delgada
npm install
npm run dev
```

O servidor de desenvolvimento fica disponível em `http://localhost:8081`.

## Comandos

| Acção | Comando | Notas |
|-------|---------|-------|
| Dev server | `npm run dev` | Porta 8081 |
| Build de produção | `npm run build` | `vite build` + pré-renderização com Playwright (gera HTML estático por rota + `sitemap.xml`) |
| Lint | `npm run lint` | ESLint |
| Preview do build | `npm run preview` | ⚠️ Não serve os ficheiros pré-renderizados — faz fallback para SPA. Para inspeccionar o resultado real do build, ver `dist/<rota>/index.html` |

O build de produção corre `scripts/prerender.js`, que precisa de um Chromium instalado (`npx playwright install chromium`). Ver [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) para detalhes do processo de deploy (Cloudflare Pages).

## Estrutura do projecto

```
src/
├── components/       — componentes React (secções, layout, ui/ do shadcn)
├── pages/             — páginas mapeadas nas rotas
├── data/              — dados estáticos do site (siteData.ts, blogData.ts)
├── lib/                — utilitários, geração de schema.org (seo.ts)
scripts/
└── prerender.js       — pré-renderização estática + geração de sitemap
docs/
├── ARCHITECTURE.md    — estrutura técnica completa
├── CONVENTIONS.md     — padrões de código (dark mode, animações, etc.)
├── MODULES.md         — páginas e secções em detalhe
├── ISSUES-BACKLOG.md  — bugs, código morto, backlog de features
└── DEPLOYMENT.md      — build e deploy
```

## Rotas

| Path | Página |
|------|--------|
| `/` | Homepage |
| `/modalidade` | Guia de hóquei em patins |
| `/calendario` | Calendário de jogos |
| `/comunicados` | Comunicados oficiais |
| `/comunicados/:slug` | Detalhe de comunicado |
| `/blog` | Blog |
| `/blog/:slug` | Artigo do blog |
| `/patrocinadores` | Patrocínios |

## Contribuir

A branch `main` é protegida — não são aceites pushes directos. Para contribuir:

1. Faz fork do repositório
2. Cria uma branch a partir de `main` (`git checkout -b feature/nome-da-feature`)
3. Faz commit das alterações
4. Abre um Pull Request

## Licença

Distribuído sob a [licença MIT](LICENSE). © Hóquei Clube PDL.
