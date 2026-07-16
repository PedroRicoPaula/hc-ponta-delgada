# Arquitectura

## Stack técnica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | React | 18 |
| Linguagem | TypeScript | 5.5 |
| Build | Vite | 6.0 |
| Estilo | Tailwind CSS | 3.4 |
| Componentes UI | shadcn/ui (Radix UI) | — |
| Animações | framer-motion | — |
| Routing | React Router | v6 |
| Temas | next-themes | — |
| SEO | react-helmet-async | — |
| Data fetching | @tanstack/react-query | — |
| Testes visuais | Playwright | 1.61 |

## Estrutura de pastas

```
scripts/
└── prerender.js                # Pós-build: snapshot de cada rota + dist/sitemap.xml
src/
├── components/
│   ├── sections/                # Secções da homepage
│   └── ui/                      # shadcn/ui — NÃO editar directamente
├── data/
│   ├── siteData.ts             # Dados do clube (jogadores, treinos, galeria, etc.)
│   └── blogData.ts             # Artigos do blog
├── hooks/                      # Hooks custom
│   ├── use-mobile.tsx
│   ├── use-toast.ts
│   └── useLocalStorage.ts
├── lib/
│   ├── utils.ts                # Utilitários gerais (cn, etc.)
│   ├── seo.ts                  # Helpers para meta tags (JSON-LD)
│   ├── safeStorage.ts          # Wrapper localStorage com fallback
│   └── games.ts                # Estado dos jogos (live/countdown/ended), useNow()
├── pages/                      # Uma página por rota
└── index.css                   # CSS global + variáveis de tema + transições globais
```

## Árvore de providores (App.tsx)

```
ErrorBoundary
  ThemeProvider (next-themes, defaultTheme="light", enableSystem=false)
    QueryClientProvider
      HelmetProvider
        TooltipProvider
          Toaster + Sonner
          BrowserRouter
            Routes
```

## Tema e dark mode

`next-themes` injeta class `dark` na tag `<html>`. Tailwind usa `darkMode: ["class"]`.

Variáveis CSS em `src/index.css`:
- `:root` → tema claro
- `.dark` → tema escuro
- `--primary: #FFC200` (constante em ambos)

Transições automáticas via selector `*` — exclui `transform` e `opacity` (framer-motion safe).

## Dados do site

### `src/data/siteData.ts`

Exporta:
- `players: Player[]` — plantel completo com stats, foto, posição
- `games: Game[]` — jogos da equipa sénior (data/hora, casa ou fora, YouTube, resultado); estado ao vivo calculado em `src/lib/games.ts`
- `trainingSchedules: TrainingSchedule[]` — horários por escalão
- `galleryItems` — momentos da galeria (imagens + YouTube)
- `sponsors` — logos e nomes dos patrocinadores
- `contactInfo` — moradas, telefone, email

### `src/data/blogData.ts`

Exporta:
- `blogPosts: BlogPost[]` — artigos com slug, título, conteúdo markdown, tags
- `getBlogPost(slug: string): BlogPost | undefined`

Slug activo: `beneficios-hoquei-em-patins`

## Assets

Todos em `public/uploads/`. Referenciados com paths absolutos (`/uploads/...`). Não importar com `import` — servidos como estáticos.

Fotos de jogadores: `public/uploads/jogadores/`

Logos de patrocinadores: `public/uploads/patrocinadores/` — inclui logos activos (referenciados em `sponsors[]`) e logos de ex-patrocinadores mantidos de propósito (ver `docs/ISSUES-BACKLOG.md`, secção Limpeza).

## SEO

`react-helmet-async` via `src/lib/seo.ts`. Cada página define as suas próprias meta tags via Helmet (title, description, canonical, og:title, og:description, og:type, og:url).

**Armadilha**: Helmet substitui `<title>` in-place mas só faz *append* de `<meta>`/`<link>` — não remove equivalentes estáticos já no `index.html`. Por isso `index.html` não define `description`/`canonical`/`og:*` (fica só `og:image`, `og:locale`, `twitter:*` como fallback comum a todas as páginas) — cada página é responsável por definir o resto via Helmet. Página nova sem esse bloco fica sem SEO próprio, silenciosamente.

**Pré-renderização** (`scripts/prerender.js`, corre depois de `vite build`): SPA puro serve o mesmo HTML (da homepage) em qualquer rota — bots que não correm JS (crawlers, link-preview do WhatsApp/Slack/etc.) só viam sempre o conteúdo de `/`, daí `site:hoqueiclubepdl.com` no Google só mostrar a página principal. O script abre cada rota num browser real (Playwright chromium), espera o React montar, e grava o DOM final em `dist/<rota>/index.html` — hosts estáticos servem esse ficheiro real em vez do fallback de SPA. Lista de rotas vem de `blogPosts[]`/`comunicados[]` via `vite.ssrLoadModule`, nunca hard-coded (só rotas estáticas tipo `/modalidade` estão na array `STATIC_ROUTES` do script — rota estática nova tem de ser adicionada ali à mão). O mesmo script gera `dist/sitemap.xml` a partir da mesma lista de rotas.

Se o Chromium do Playwright não estiver instalado (`npx playwright install chromium`), o passo de pré-renderização é saltado com aviso — build nunca falha por causa disto, só perde a pré-renderização.

`src/main.tsx` usa `createRoot` (não `hydrateRoot`) mesmo com markup pré-renderizado presente — `whileInView` do framer-motion depende da posição de scroll/viewport no momento do mount, que é diferente entre o snapshot do prerender e o browser real de cada visitante; `hydrateRoot` trata isso como mismatch (React #418/#423). `createRoot` simplesmente substitui o markup pré-renderizado, sem reconciliação.
