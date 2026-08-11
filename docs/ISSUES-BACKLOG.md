# Issues & Backlog

## 🔴 Bugs Activos

_(nenhum confirmado — última verificação: 2026-07-13)_

---

## 🟡 Limpeza / Código Morto

### Dependências Radix UI — auditadas, mantidas de propósito
~30 componentes em `src/components/ui/` (accordion, badge, calendar, chart, table, sidebar, etc.) nunca são importados por nenhuma página/secção — confirmado por audit em 2026-07-02 (`grep` de cada ficheiro `ui/*.tsx` contra o resto de `src/`). Custo real no bundle final é **zero** (Vite só inclui o que é importado). Decisão: manter — é scaffolding padrão do shadcn ("não editar directamente", ver CLAUDE.md) e fica disponível para features futuras sem risco. Não voltar a levantar esta questão a menos que o número cresça muito.

### Logos de patrocinadores antigos — ficheiros mantidos, não usados nos dados
`public/uploads/patrocinadores/` tem os logos de 3 ex-patrocinadores (`AutoCordeiroLogo1.png`, `CrenkuLogo.png`, `FunerariaLindoLogo.jpg`) que já não estão em `sponsors[]` (`src/data/siteData.ts`) desde 2026-07-16 — substituídos pelos patrocinadores actuais. Mantidos de propósito a pedido (podem voltar a ser precisos). Não são código morto a limpar — se o número de logos "arquivados" crescer muito, considerar mover para uma subpasta `arquivo/`.

---

## 🟢 Backlog de Features

### ~~Calendário de jogos — adversários reais, datas ainda artificiais~~ ✅ RESOLVIDO 2026-08-11
Implementado em 2026-07-13: card "Próximo Jogo" em `EventsSection` (contagem decrescente 24h antes, botão "Ver Ao Vivo" nos jogos em casa com diálogo de confirmação antes de sair para o YouTube) + página `/calendario` (`src/pages/Calendario.tsx`, grelha com todos os jogos, terminados a cinzento). Dados em `games[]` (`src/data/siteData.ts`), estado calculado em `src/lib/games.ts`.

**Resolvido em 2026-08-11**: `games[]` passou a ser o calendário oficial da época 2026/27, extraído de `https://hp.fpp.pt/Competicao/501` (CN 3ª Divisão Sul B). 26 jornadas, 13 em casa e 13 fora, 14 equipas na série — sem bye. Cada jogo ganhou o campo `jornada`. As datas artificiais e os pavilhões inventados dos jogos fora desapareceram.

**O que continua por preencher, e é normal:** a FPP só marcou hora para as jornadas 2, 11 e 26. Os restantes 23 jogos ficam com `time` ausente e a UI mostra "Horário a definir" (ver `formatGameTime()`). Os pavilhões dos jogos fora não constam da FPP — ficam `"A definir"` em vez de nomes inventados.
**Como actualizar quando a FPP marcar horas**: acrescentar `time: "HH:mm"` ao jogo respectivo em `games[]`. Nada mais é preciso — a UI, o estado ao vivo e o schema adaptam-se sozinhos.
**Resultados**: continuam a ser preenchidos à mão em `result` depois de cada jogo, não há cálculo automático.

### Galeria com fotos reais da época
`GallerySection` usa YouTube embed + poucas imagens. Adicionar fotos de jogos, treinos e eventos da época 2026/2027.

### Actualização do plantel 2026/2027
`TeamSection` e `players[]` em `siteData.ts` precisam de revisão no início de cada época. Incluir novos atletas, remover saídas, actualizar stats.

### Mais artigos no Blog
1 artigo actualmente. Sugestões:
- História do clube (fundação 2012, conquistas)
- Resumo de resultados da época
- Perfis de jogadores
- Notícias de recrutamento / inscrições para formação

### ChatWidget — desligado, à espera de webhook real
`ChatWidget.tsx` existe mas está **desligado** (import comentado em `Index.tsx`, confirmado em 2026-07-02). Aponta para `WEBHOOK_URL` placeholder do **Make.com** (não n8n, ao contrário do que estava documentado) com TODO por preencher.
**Acção**: quando o webhook estiver pronto, preencher `WEBHOOK_URL` e descomentar import + `<ChatWidget />` em `Index.tsx`.

### SEO — og:image ainda genérico
`og:image`/`twitter:image` continuam a apontar sempre para `pdlLogo.png` em todas as páginas — nenhuma página define uma imagem própria via `Helmet`. Canonical/og:title/og:description/og:type/og:url por página já foram corrigidos em 2026-07-16 (ver ✅ Resolvido) — falta só a imagem.
**Acção**: adicionar `og:image` específico nas páginas onde faz sentido (ex: artigo do Blog com imagem de capa, Comunicado com imagem, se/quando existirem).

### PWA — estratégia de cache
`public/sw.js` existe mas estratégia de caching não foi revista.
**Acção**: rever precache de assets estáticos e estratégia offline para fotos de jogadores.

### Internacionalização (baixa prioridade)
Site 100% em PT. Possível futuro: EN para visibilidade internacional do clube.

### Botões flutuantes fixos podem roçar conteúdo em scroll longo (mobile)
`SocialIcons`/`FloatingActionButtons` são `position: fixed` a uma % fixa do viewport; em páginas longas de coluna única (ex: `TrainingSchedulesSection` no mobile), a determinadas posições de scroll o botão "Mini Jogo" pode tocar ~3px na margem do texto de horário mais próximo. Sobreposição mínima (não afecta hero, já corrigido), mas é uma limitação estrutural do padrão "rail fixo sobre página longa". **Acção futura**: considerar auto-hide ao fazer scroll ou mover para bottom-sheet no mobile, se for incomodativo na prática.

---

## ✅ Resolvido

| Data | Issue |
|------|-------|
| 2026-07 | **Logo invisível em dark mode** — wrappado em `bg-white rounded-xl` em Navigation e Footer |
| 2026-07 | **Banners "em construção"** — removidos de TeamSection, EventsSection, TrainingSchedulesSection |
| 2026-07 | **Dark mode incompleto** — todas as secções, páginas (Blog, BlogPost, Modalidade, Patrocinadores) e modais actualizados |
| 2026-07 | **BlogPost sem dark mode** — corrigido `renderMarkdown()` com classes `dark:` em todo o HTML gerado |
| 2026-07 | **DonationsModal sem dark mode** — adicionado `dark:bg-gray-900` e variantes dark em todos os elementos |
| 2026-07 | **QueroSerPatrocinador hardcoded dark** — reescrita completa (~1142 linhas) com pares light/dark em todas as secções |
| 2026-07 | **TeamSection: duplicate style attr TS error** — merged `aspectRatio` e `transformPerspective` num só `style={{}}` |
| 2026-07 | **Transições CSS quebravam framer-motion** — `transition-property` em `*` exclui `transform` e `opacity` |
| 2026-07 | **AboutSection feature items sempre dark** — `bg-gray-950` → `bg-gray-100 dark:bg-gray-800`; texto adaptado com pares `dark:` |
| 2026-07 | **DonationsModal não abria noutras páginas** — estado movido para inside `Footer` (padrão Navigation); removida prop `onOpenDonations` |
| 2026-07 | **Footer Explorar com links desnecessários** — removidos Sobre Nós/Equipa/Galeria/Contactos; ficam Blog, Patrocinadores, Modalidade |
| 2026-07 | **LegalModal sem Política de Cookies** — adicionado tipo `'cookies'` e conteúdo completo |
| 2026-07 | **Menu mobile transparente** — `Navigation.tsx`: `bg-white/98 dark:bg-gray-950/98` não é um step válido de opacidade Tailwind, classe não compilava (`rgba(0,0,0,0)`), texto da hero atravessava o menu. Corrigido para `/95` |
| 2026-07 | **Página 404 sem branding** — `NotFound.tsx` reescrita: PT, dark mode, Navigation + Footer, `noindex` |
| 2026-07 | **Meta tags com erro + URL relativa** — `index.html`: "na região na região autónoma" duplicado em og/twitter description; `og:image`/`twitter:image` passaram a absolutos |
| 2026-07 | **Botões flutuantes sobrepostos ao heading da hero (mobile)** — `SocialIcons.tsx` e `FloatingActionButtons.tsx` tinham `top-[55%]`, colidia com a bounding box do `<h1>` da Hero (confirmado por medição de rects). Movido para `top-[68%]` |
| 2026-07 | **`ComunicadosPanel` sem nenhuma classe `dark:`** — painel inteiro ilegível em dark mode; adicionados pares `bg-X dark:bg-Y` em todos os elementos |
| 2026-07 | **Modais custom sem Escape/ARIA** — `DonationsModal`, `ComunicadosPanel`, `RollerHockeyGame` não fechavam com Escape e não tinham `role="dialog"`/`aria-modal`. `LegalModal` já usava Radix Dialog (ok por defeito). Adicionado handler de Escape + atributos ARIA aos 3 |
| 2026-07 | **Ficheiros HTML órfãos em `public/`** — `index2.html` a `index6.html` removidos (protótipos sem referências) |
| 2026-07 | **`treinosFormacaoPage/` removido** — confirmado código morto (sem `<Route>`, sem imports externos) por duas análises independentes; removidos os 6 componentes + `managementTypes.ts` + `treinosFormacaoTypes.ts` |
| 2026-07 | **`RollerHockeyGame.tsx` — confirmado não é código morto** — é o painel do botão flutuante "Mini Jogo", montado em `Index.tsx`, acessível e funcional |
| 2026-07 | **`BlogPreviewSection.tsx` e `TickerStrip.tsx` removidos** — criados mas nunca importados em nenhuma página |
| 2026-07 | **Navbar principal transparente em todas as páginas** — `Navigation.tsx`: `bg-white/92 dark:bg-gray-950/92`, `/92` não é step válido de opacidade Tailwind (só múltiplos de 5), classe não compilava, `background-color` ficava `rgba(0,0,0,0)`. Confirmado por computed style + visualmente (cores dos cards de jogadores a atravessar a navbar ao fazer scroll). Corrigido para `/95`. Mesma classe de bug do menu mobile (`/98`) — varrida a codebase toda, sem mais casos |
| 2026-07 | **Watermark decorativo (U11/U13/U17) sobrepunha o último horário de cada card** — `TrainingSchedulesSection.tsx`: numeral gigante `position:absolute` sem z-index pinta por cima de conteúdo estático (regra CSS de stacking), confirmado por medição de bounding box (~90px de sobreposição horizontal, 100% da altura do texto). Adicionado `relative z-10` ao heading e à lista de horários de cada card |
| 2026-07 | **`text-primary/8` no mesmo watermark também inválido** — `/8` não é step válido (só múltiplos de 5); em light mode o numeral aparecia sólido e escuro em vez de um watermark subtil. Corrigido para `/10` |
| 2026-07 | **Crash `Cannot read properties of null (reading 'useMemo')` no Select do Mini Jogo** — cache de pré-bundling do Vite (`node_modules/.vite`) desincronizada da árvore de módulos depois de apagar/mover muitos ficheiros nesta sessão. Não era bug de código; resolvido com `rm -rf node_modules/.vite` + reiniciar o dev server. Regra documentada em CLAUDE.md |
| 2026-07 | **Botão "Mini Jogo" sem nome acessível no mobile** — `FloatingActionButtons.tsx`: o texto "MINI JOGO" tinha `hidden sm:block`, e o botão não tinha `aria-label`; leitores de ecrã não anunciavam nada no mobile. Adicionado `aria-label="Abrir mini jogo"` |
| 2026-07 | **`HeroSection` (homepage) sempre dark mesmo fora da foto** — painel de texto (esquerda) estava hardcoded dark (`bg-[#0a0a0a]`, `text-white`, etc.) sem nenhum par `dark:`, ignorando o tema por completo. Tornado reactivo ao tema: `bg-white dark:bg-[#0a0a0a]` + pares `dark:` em todo o texto; o painel da foto (direita) mantém-se sempre escuro por ser estruturalmente necessário (fade overlay). Ver regra actualizada em CLAUDE.md |
| 2026-07 | **`NextGameCard` (Próximo Jogo, na Hero) melhorado** — reposicionado ligeiramente para a esquerda/cima (`top-42%→38%`, `left-1/2→46%`); adicionado float 3D contínuo e suave (`y: [0,-7,0]`, 4.5s loop) + tilt 3D no hover; adicionado glow que segue o cursor ao longo da borda (CSS custom properties `--mx`/`--my` actualizadas via `onMouseMove`, radial-gradient posicionado nessas coordenadas) |
| 2026-07 | **Botões inconsistentes entre secções/páginas** — auditoria encontrou 3 famílias visuais de botão coexistindo sem critério (sharp/font-heading, shadcn rounded-md por defeito, e uma terceira variante ad-hoc `rounded-lg`/`text-white`/`font-medium`). Corrigido: `TeamSection.tsx` (usava `<Button>` shadcn genérico em vez do estilo sharp), `ComunicadosPanel.tsx` (botão "Consultar PDF"), `ContactSection.tsx` (`hover:text-black`→`hover:text-gray-950` para bater com `SponsorsSection`), e toda a `QueroSerPatrocinador.tsx` (6 CTAs incl. modal WhatsApp, cantos arredondados → rectos, `font-bold`/`font-semibold` sentence-case → `font-heading font-black uppercase`). Cards/containers da página de Patrocinadores **mantidos** arredondados de propósito — isso já é o padrão em `TeamSection`/`Blog`/`Modalidade` também, não era a inconsistência real. Convenção documentada em `docs/CONVENTIONS.md` |
| 2026-07 | **Número "2012" na AboutSection quase invisível** — `opacity: 0.06` estático, sem interacção. Iteração final: opacidade base `0.24` (`0.4` no hover), sombra em camadas (`textShadow` com 6 offsets crescentes) para efeito de extrusão/relevo 3D, float idle contínuo (`y: [0,-10,0]`, 5s loop), e tilt 3D que segue o cursor em tempo real via `useMotionValue`/`useSpring`/`useTransform` do framer-motion (mesmo padrão do glow do `NextGameCard`) |
| 2026-07 | **Logo da Navigation não limpava hash da URL** — clicar no logo estando em `/#team` (por exemplo) fazia scroll para o topo mas a URL continuava `/#team`. Corrigido: `Link to="/"` + `window.history.replaceState` a limpar o hash antes do scroll. Também deixou de ser `<a>` cru para páginas não-home (era reload completo, agora é navegação client-side) |
| 2026-07 | **Nav bar reestruturada** — removidos os links de âncora Sobre/Equipa/Galeria (secções continuam a existir, só sem atalho no menu); Modalidade e Patrocinadores passaram a estar na nav principal (antes só no footer); Contactos passou a viver junto de Blog/Modalidade/Patrocinadores. Clique em "Contactos" a partir de outra página não fazia scroll nenhum (o browser tentava saltar para `#contact` antes da secção existir no DOM, já que é uma SPA client-rendered) — corrigido com efeito em `Index.tsx` que observa `location.hash` e faz `scrollIntoView` assim que a secção existe |
| 2026-07 | **Página de Comunicados criada** — `/comunicados` (lista) + `/comunicados/:slug` (detalhe), mesmo padrão do Blog. `generateNewsSchema()` em `seo.ts` já gerava JSON-LD `NewsArticle` para os comunicados mas não existia página nenhuma para indexar — adicionado campo `url` ao schema apontando para a nova rota. `ComunicadosPanel` (painel lateral) mantido para consulta rápida, agora linka para as páginas novas |
| 2026-07 | **`ComunicadosPanel` tapado pelo banner de cookies** — painel e `CookieConsent` tinham ambos `z-50`; como o banner renderiza depois no DOM (em `Index.tsx`), pintava por cima e bloqueava cliques nos itens/links do fundo do painel (confirmado: `Não aceitar` interceptava o clique). Painel subido para `z-[60]` |
| 2026-07 | **Comunicados adicionado à nav principal** — nav ficou Modalidade, Patrocinadores, Blog, Comunicados, Contactos (5 items, sem overflow testado a 1440px) |
| 2026-07 | **AboutSection: "Formação de Elite" → "Formação"** — texto do feature item simplificado; descrição passou de "Sub 11, 13, 17 e Seniores" para "Escolinhas, Sub 11, 13, 17" (removidos Seniores, adicionadas Escolinhas) |
| 2026-07 | **Modalidade ilegível em mobile/tablet vertical (<768px)** — `Modalidade.tsx:208`: contentor `flex gap-8` nunca mudava para coluna, o `<select>` de secções (mobile) ficava lado a lado com o painel de conteúdo em vez de empilhado, conteúdo espremido para fora do ecrã (confirmado por medição: `scrollWidth` 623px vs 390px de viewport). Corrigido com `flex-col md:flex-row`. Verificado sem overflow a 390/768/1440 |
| 2026-07 | **Card "Próximo Jogo" sobrepunha texto em mobile** — `EventsSection.tsx`: etiqueta da competição e badge de estado na mesma linha `justify-between` sem quebra prevista; com "Campeonato Nacional da 3ª Divisão" (mais comprido que "Liga Nacional") o texto sobrepunha-se ao badge a 390px. Corrigido para `flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between` — empilha em mobile, linha única a partir dos 640px |
| 2026-07 | **Legendas das zonas de patrocínio cortadas em mobile** — `QueroSerPatrocinador.tsx`: mapa de zonas em grelha de 2 colunas a mobile truncava os nomes ("Ombr…", "Peito…"). Corrigido para 1 coluna sempre (`grid-cols-1`, igual ao que já acontecia a partir do `md:`), nomes completos legíveis |
| 2026-07 | **Nome de jogador cortado no tablet (768px)** — `TeamSection.tsx`: "Alexandre Resendes" truncava para "Alexandre Resen…" na grelha de 5 colunas. Removido `truncate` do nome no card da frente — agora quebra para 2 linhas em vez de cortar (badge de posição continua por baixo em fluxo normal, sem colisão) |
| 2026-07 | **Modalidade reescrita — conteúdo genérico/impreciso e emoji como ícones** — página inteira reescrita com factos verificados por pesquisa (história, títulos de Portugal, regras oficiais — ver fontes citadas na sessão). Corrigido erro factual antigo ("Portugal tricampeão mundial" → é vice-campeã histórica, 16 títulos atrás só da Espanha com 18). Emojis (🏒📜👥📋⚙️📖 e outros) substituídos por ícones `lucide-react`; posições passaram a usar o mesmo código de cores do `TeamSection` em vez de emoji |
| 2026-07 | **Cards de jogadores: stats genéricas e nacionalidade em texto** — `TeamSection.tsx`: tiles passaram de retangulares para quase quadrados (`aspect-square`); nacionalidade mostra bandeira (🇵🇹 via lookup `nationalityFlags`) em vez do texto "PT"; guarda-redes mostram "P"/"L" (penáltis/livres diretos defendidos, novos campos `penaltySaves`/`freeHitSaves` em `PlayerStats`) em vez de Golos/Assist., que não fazem sentido para a posição; tile "Desde" (ano de entrada, pouco interessante) removido, "Jogos" encurtado para "J". Campo `since` removido de `PlayerStats` e de todos os jogadores (ficou por usar) |
| 2026-07 | **Patrocinadores: só 5 antigos, sem destaque nenhum** — `sponsors[]` actualizado com os patrocinadores actuais (Agri Tractores, Azemad, Catchawards, Junta de Freguesia de Santa Clara, Câmara Municipal de Ponta Delgada, Pérola da Ilha, AFISA, Lene Car); logos movidos para `public/uploads/patrocinadores/`. `SponsorsSection.tsx` passou a destacar um patrocinador principal (`featured: true` nos dados) sozinho e maior por cima, com os restantes mais pequenos por baixo (linha em desktop, carrossel em mobile) |
| 2026-07 | **`site:hoqueiclubepdl.com` só mostrava a homepage** — causa confirmada ao vivo (`curl` a `/`, `/modalidade`, `/blog` devolvia sempre o mesmo `<title>` e `<link rel="canonical" href=".../">`, apontando tudo para a homepage): SPA pura, `index.html` estático é o mesmo para qualquer rota, `Helmet` só corrige título/meta depois do JS correr — qualquer crawler que não espere pelo JS via a homepage em todo o lado. Resolvido com `scripts/prerender.js` (pós-`build`, snapshot de cada rota real com Playwright para `dist/<rota>/index.html`) + `dist/sitemap.xml` gerado a partir de `blogPosts[]`/`comunicados[]` (sem lista de rotas hard-coded a ficar desactualizada). Ver `docs/ARCHITECTURE.md` |
| 2026-07 | **Prerendering revelou tags `<meta>`/`<link>` duplicadas** — `react-helmet-async` substitui `<title>` correctamente mas só **acrescenta** `<meta>`/`<link data-rh>`; não remove os equivalentes estáticos do `index.html`. Antes da pré-renderização isto não se notava (só o browser via a versão pós-JS); com HTML estático por rota, `canonical`/`description`/`og:title`/`og:description`/`og:type`/`og:url` apareciam **duplicados** em cada página (um errado + um certo). Removidos do `index.html` estático (ficam só `title`, `og:image`, `og:locale`, `twitter:*`, que nenhuma página sobrepõe); `og:url` (e `og:type`/`og:description` onde faltavam) adicionados a todas as páginas que ainda não os definiam via `Helmet`. Confirmado por grep a `dist/` — exactamente 1 de cada tag por rota |
| 2026-07 | **`hydrateRoot` causava erros de hidratação (React #418/#423)** — tentativa de trocar `createRoot` por `hydrateRoot` (para não haver "flash" ao substituir o HTML pré-renderizado) partiu em `/modalidade`: secções usam `whileInView` do framer-motion, cujo estado "já visível" depende do scroll/viewport no momento do snapshot — diferente do viewport de cada visitante real, o que o React trata como mismatch de hidratação e força um re-render completo do zero na mesma. Revertido para `createRoot` simples — o benefício de SEO (HTML correcto na resposta inicial) é igual com qualquer um dos dois, só o hydrateRoot introduzia erros sem ganho real dado este padrão de animação |
