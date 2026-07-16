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
src/
├── components/
│   ├── sections/               # Secções da homepage
│   │   └── treinosFormacaoPage/  # Painel interno (sem rota activa — ver ISSUES-BACKLOG)
│   └── ui/                     # shadcn/ui — NÃO editar directamente
├── data/
│   ├── siteData.ts             # Dados do clube (jogadores, treinos, galeria, etc.)
│   └── blogData.ts             # Artigos do blog
├── hooks/                      # Hooks custom
│   ├── use-mobile.tsx
│   ├── use-toast.ts
│   └── useLocalStorage.ts
├── lib/
│   ├── utils.ts                # Utilitários gerais (cn, etc.)
│   ├── seo.ts                  # Helpers para meta tags
│   ├── safeStorage.ts          # Wrapper localStorage com fallback
│   ├── games.ts                # Estado dos jogos (live/countdown/ended), useNow()
│   ├── managementTypes.ts      # Tipos para painel de gestão interno
│   └── treinosFormacaoTypes.ts # Tipos para módulo de treinos
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

`react-helmet-async` via `src/lib/seo.ts`. Cada página define as suas próprias meta tags via Helmet.
