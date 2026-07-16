# Convenções de Código

## Dark mode — regra absoluta

Sempre pares `bg-X dark:bg-Y` e `text-X dark:text-Y`. Nunca uma cor hardcodada para dark only.

### Tabela de referência

| Contexto | Light | Dark |
|----------|-------|------|
| Fundo de página/secção principal | `bg-white` | `dark:bg-gray-950` |
| Fundo alternado (zebra) | `bg-gray-50` | `dark:bg-gray-900` |
| Cards e surfaces elevados | `bg-white` | `dark:bg-gray-800/50` |
| Texto principal | `text-gray-900` | `dark:text-white` |
| Texto secundário/muted | `text-gray-600` | `dark:text-gray-400` |
| Texto muito fraco | `text-gray-400` | `dark:text-gray-500` |
| Bordas | `border-gray-200` | `dark:border-white/10` |
| Bordas subtis | `border-gray-100` | `dark:border-white/5` |
| Input/form bg | `bg-gray-100` | `dark:bg-gray-800` |
| Feature items / cards de destaque | `bg-gray-100` | `dark:bg-gray-800` |

**Excepções deliberadas** (sempre dark — não alterar):

| Componente | Classe | Razão |
|-----------|--------|-------|
| `HeroSection` | `bg-[#0a0a0a]` | Foto de equipa com fade overlay — não funciona em fundo claro |
| Hero de `QueroSerPatrocinador` | `bg-[#0a0a0a]` | Mesma razão — foto de equipa |
| `NextGameCard` (dentro de HeroSection) | `bg-black/65` | Overlay translúcido sobre imagem — precisa de fundo escuro para contraste |
| `NextGameFeature` (dentro de EventsSection) | `bg-gray-950 dark:bg-black` | Card "scoreboard" — evolução do `NextGameCard`, mesma identidade visual. Não está sobre foto; sempre escuro é opção estética intencional (painel de resultados), não esquecimento de `dark:` |

**Armadilha conhecida — `bg-gray-950`**: Usar `bg-gray-950` sem `dark:` em componentes dentro de secções claras faz com que o site pareça não ter light mode. Os feature items de `AboutSection` tinham este bug (`bg-gray-950 dark:bg-gray-800` → corrigido para `bg-gray-100 dark:bg-gray-800`). Regra: `bg-gray-950` só em contextos intencionalmente sempre-dark.

## Animações framer-motion

### Entrada de secção (scroll entry)

```tsx
<motion.section
  initial={{ opacity: 0, y: 40, rotateX: 3 }}
  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
  viewport={{ once: true, amount: 0.1 }}
  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
  style={{ transformPerspective: 1200 }}
>
```

### Hover de card (3D lift)

```tsx
<motion.div
  whileHover={{ y: -4, scale: 1.02, rotateY: 2 }}
  style={{ transformPerspective: 600 }}
>
```

### Stagger de filhos

```tsx
// Parent
<motion.div variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
// Child
<motion.div variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}>
```

### Regra importante
`src/index.css` exclui `transform` e `opacity` da transição CSS global em `*` — não adicionar essas propriedades. framer-motion gere-as por inline styles.

## Botões — duas famílias, não misturar

Auditado em 2026-07: o site usa **duas linguagens visuais diferentes de propósito**, cada uma com o seu contexto — a inconsistência real não é ter as duas, é misturá-las dentro do mesmo contexto.

**CTA de marca** (acção principal — "Doação", "Ver Pacotes", "Falar Connosco", CTAs de secção): cantos rectos (sem `rounded-*`), `font-heading font-black uppercase tracking-wider`, cor sólida `bg-primary text-gray-950` (ou outline `border-primary text-primary hover:bg-primary hover:text-gray-950`). Ver `Navigation.tsx` (botão Doação) como referência canónica. Implementados como `<button>`/`<a>` simples, não o componente `Button` do shadcn (que traz `rounded-md` por defeito e teria de ser sobreposto).

**Controlo utilitário** (tabs, paginação, nav lateral, acções de dialog como Cancelar/Confirmar): pode usar o componente `Button`/`Dialog` do shadcn tal como vem, com o seu `rounded-md` e `font-medium` — ex: `Blog.tsx` paginação, `Modalidade.tsx` sidebar, `QueroSerPatrocinador.tsx` tab switcher "Plantel Sénior/Formação", `TeamSection.tsx` Dialog de confirmação.

Cards e containers (imagens, stat tiles, painéis) usam `rounded-lg`/`rounded-xl`/`rounded-2xl` **em todo o site** — isso não é inconsistência, é o padrão. Só os *botões de CTA de marca* têm de ser sempre rectos.

## Logo

`pdlLogo.png` é escuro — invisível sem wrapper branco:

```tsx
<div className="bg-white rounded-xl p-1.5 inline-flex shadow-sm border border-gray-200 dark:border-transparent">
  <img src="/uploads/pdlLogo.png" alt="Hóquei Clube PDL" className="h-8 w-auto" loading="lazy" />
</div>
```

Aplica em **Navigation.tsx** e **Footer.tsx** — sempre os dois.

## Nome do clube

Forma curta em toda a UI e metadados: **"Hóquei Clube PDL"** (ou **"HC PDL"**). Nunca escrever por extenso "Hóquei Clube Ponta Delgada", "Hóquei Clube de Ponta Delgada" ou "HC Ponta Delgada" — foram normalizados em 2026-07-16 (títulos de página, meta tags, JSON-LD, manifest, footer, copy). Ao escrever conteúdo novo (artigos, comunicados, meta descriptions), usar sempre a forma curta.

## Ícones — lucide-react, não emoji

Emoji como ícone de UI (secções, cards, listas) foi removido da página `Modalidade` em 2026-07-16 a pedido — lia-se como pouco profissional e inconsistente entre plataformas/temas. Preferir `lucide-react` (já é dependência do projecto, usado em `Navigation`, `TeamSection`, `SponsorsSection`, etc.): ícone `w-4 h-4`/`w-5 h-5`, cor `text-primary` ou herdada do texto. Onde não houver um ícone lucide que faça sentido (ex: tipos de equipamento), preferir tipografia forte (título a negrito) a forçar uma metáfora visual fraca. Emoji dentro de conteúdo de dados (não UI) — ex.: bandeiras de nacionalidade em `TeamSection` (`nationalityFlags`) — não está abrangido por esta regra, é conteúdo, não ícone de interface.

## TypeScript

- Easing arrays: cast obrigatório `as [number,number,number,number]` (framer-motion exige tuple)
- Sem `any` — preferir tipos explícitos ou `unknown`
- `interface` para props de componentes, `type` para aliases e uniões

## Comentários

Só quando o WHY é não-óbvio: invariante oculta, workaround específico, comportamento que surpreende um leitor. Sem comentários que explicam o quê.

## Modais custom (não-Radix)

`DonationsModal.tsx`, `ComunicadosPanel.tsx` e `RollerHockeyGame.tsx` são overlays `fixed` feitos à mão com `framer-motion` (não usam `@/components/ui/dialog`). `LegalModal.tsx` usa Radix Dialog e já trata disto automaticamente — só os custom precisam do padrão manual:

```tsx
useEffect(() => {
  if (!isOpen) return;
  const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
  document.addEventListener('keydown', handleKey);
  return () => document.removeEventListener('keydown', handleKey);
}, [isOpen, onClose]);
```

E no container do painel: `role="dialog"` `aria-modal="true"` `aria-label="..."`. Qualquer novo overlay custom (não-Radix) deve seguir este padrão — sem ele, o painel não fecha com Escape e leitores de ecrã não o anunciam como diálogo.

## Componentes shadcn/ui

Em `src/components/ui/` — não editar directamente. Personalizar via `className` prop ou CSS variables. Instalar novos com `npx shadcn@latest add <componente>`.

## SEO por página

```tsx
import { Helmet } from 'react-helmet-async';

<Helmet>
  <title>Título da Página | HC PDL</title>
  <meta name="description" content="..." />
  <link rel="canonical" href="https://hoqueiclubepdl.com/rota" />
  <meta property="og:title" content="Título da Página | HC PDL" />
  <meta property="og:description" content="..." />
  <meta property="og:type" content="website" /> {/* "article" em posts de blog/comunicados */}
  <meta property="og:url" content="https://hoqueiclubepdl.com/rota" />
</Helmet>
```

**Armadilha conhecida (2026-07)**: Helmet substitui `<title>` in-place mas só faz *append* de `<meta>`/`<link>` — nunca remove um equivalente estático já existente no `index.html`. Por isso `index.html` **não** define `description`/`canonical`/`og:title`/`og:description`/`og:type`/`og:url` (só `og:image`/`og:locale`/`twitter:*`, comuns a todas as páginas) — cada página é 100% responsável pelo bloco acima via Helmet. Página nova sem este bloco fica sem SEO próprio, sem erro visível (só se nota inspeccionando o HTML gerado).

Página nova com rota **estática** (não dinâmica tipo `:slug`) também tem de ser adicionada à array `STATIC_ROUTES` em `scripts/prerender.js`, senão fica sem HTML pré-renderizado próprio (crawlers continuam a ver a homepage nessa rota). Rotas dinâmicas (`/blog/:slug`, `/comunicados/:slug`) são descobertas automaticamente a partir de `blogPosts[]`/`comunicados[]` — não precisam de nada manual. Detalhe do mecanismo em `docs/ARCHITECTURE.md`, secção SEO.

## Dados vs. código

Conteúdo do clube (jogadores, horários, patrocinadores, artigos) vive em `src/data/`. Não hardcodar dados no JSX — actualizar os ficheiros de dados.
