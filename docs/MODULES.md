# Módulos e Páginas

## Homepage (`/` → `src/pages/Index.tsx`)

Secções em ordem de renderização:

| # | Secção | Componente | Anchor ID | Nota |
|---|--------|-----------|-----------|------|
| 1 | Hero | `HeroSection.tsx` | `#hero` | Painel de texto reactivo ao tema; painel da foto (desktop only) sempre dark + fade overlay + card "Próximo Jogo" flutuante com glow que segue o cursor. Lê `games[]` (mesma fonte que `EventsSection`/Calendário) — só mostra bolinha vermelha quando o jogo está `live`, sem interacção |
| 2 | Treinos | `TrainingSchedulesSection.tsx` | `#training` | Horários por escalão — actualizar início de época |
| 3 | Equipa | `TeamSection.tsx` | `#team` | Cards flip com stats (tiles quase quadrados); links para FPP. Stats dependem da posição — guarda-redes mostram "P"/"L" (penáltis/livres diretos defendidos) em vez de Golos/Assist.; nacionalidade mostra bandeira (`nationalityFlags` lookup) em vez de texto |
| 4 | Eventos | `EventsSection.tsx` | `#events` | Card "Próximo Jogo" grande (contagem decrescente 24h antes; botão "Ver Ao Vivo" nos jogos em casa, com diálogo de confirmação antes de abrir o YouTube; jogos fora só mostram bolinha "ao vivo" sem transmissão) + botão "Ver Calendário" → `/calendario`. Adversários já são reais (fonte FPP), datas ainda artificiais — ver `docs/ISSUES-BACKLOG.md` |
| 5 | Galeria | `GallerySection.tsx` | `#gallery` | Carousel + embed YouTube |
| 6 | Contactos | `ContactSection.tsx` | `#contact` | Morada, email, telefone |
| 7 | Patrocinadores | `SponsorsSection.tsx` | `#sponsors` | Um patrocinador com `featured: true` em `sponsors[]` aparece sozinho e maior por cima; os restantes em linha (desktop) ou carrossel (mobile) por baixo, mais pequenos |

### Componentes globais (presentes em todas as páginas)

| Componente | Função |
|-----------|--------|
| `Navigation.tsx` | Navbar top: Modalidade/Patrocinadores/Blog/Contactos + ThemeToggle + botão Doação. Logo faz scroll-to-top e limpa hash da URL quando já em `/` |
| `Footer.tsx` | Rodapé — Explorar (Blog/Patrocinadores/Modalidade/Comunicados), Informações (Termos/Privacidade/Cookies), DonationsModal interno |
| `SocialIcons.tsx` | Ícones flutuantes laterais (Facebook, Instagram, YouTube) |
| `CursorRing.tsx` | Cursor personalizado (só desktop) |
| `CookieConsent.tsx` | Banner RGPD |
| `FloatingActionButtons.tsx` | FABs flutuantes (doação, whatsapp, etc.) |
| `DonationsModal.tsx` | Modal de doação com IBAN |
| `HolidayOverlay.tsx` | Overlay sazonal ativado por data |
| `ErrorBoundary.tsx` | Captura de erros React |
| `ScrollToTop.tsx` | Botão flutuante "↑" (canto inf. esquerdo) — aparece após 300px de scroll. **Não** é reset automático de scroll em mudança de rota, apesar do nome |

---

## Blog (`/blog` → `src/pages/Blog.tsx`)

Listagem de artigos sem filtros. Dados: `src/data/blogData.ts`.

Cards mostram: data, título, excerto, link "Ler artigo →". Sem categoria, sem tags, sem ícones. Se o artigo não tiver foto, o card não mostra área de imagem.

Paginação activa quando `blogPosts.length > 6` (6 posts por página, setas ← Anterior / Próximo →).

---

## Artigo (`/blog/:slug` → `src/pages/BlogPost.tsx`)

Renderiza um artigo individual. Conteúdo em Markdown via `renderMarkdown()` interno.

Slug activo: `beneficios-hoquei-em-patins`

Para adicionar artigo: acrescentar entrada em `src/data/blogData.ts`.

---

## Modalidade (`/modalidade` → `src/pages/Modalidade.tsx`)

Documentação sobre hóquei em patins. Sidebar com navegação interna por âncoras:
- O que é?
- História
- Posições
- Regras Básicas
- Equipamento
- Glossário

Conteúdo reescrito em 2026-07-16 com factos verificados (história, títulos de Portugal, regras oficiais — distâncias de livre direto/penalty, etc.). Ícones das secções e posições são `lucide-react`, não emoji — ver `docs/CONVENTIONS.md`. Ao editar esta página, manter factos verificáveis em vez de reintroduzir texto genérico.

---

## Patrocinadores (`/patrocinadores` → `src/pages/QueroSerPatrocinador.tsx`)

Proposta de valor para potenciais patrocinadores. Secções:
- Hero (sempre dark — foto de equipa)
- Stats do clube
- Pilares de comunicação
- Canais de visibilidade
- Pacotes de patrocínio (tab Naming Rights / Lonas Publicitárias)
- Outras formas de contribuição
- CTA com link WhatsApp

Botões de CTA seguem a família "sharp" (ver `docs/CONVENTIONS.md`) — cards/containers mantêm-se `rounded-xl`/`rounded-2xl`.

---

## Comunicados (`/comunicados` → `src/pages/Comunicados.tsx`, `/comunicados/:slug` → `src/pages/ComunicadoDetail.tsx`)

Lista + página individual, mesmo padrão do Blog. Dados: `comunicados[]` em `src/data/siteData.ts` (interface `Comunicado`, helpers `getComunicado(slug)`, `parseComunicadoDate()`, `getRecentComunicados()`).

`ComunicadosPanel.tsx` (painel lateral accionado pelo botão flutuante "Ver comunicados") continua a existir para consulta rápida — cada item linka para a página de detalhe, e tem "Ver todos os comunicados →" no fundo da lista. Painel usa `z-[60]` (acima do `z-50` do `CookieConsent`) para não ficar tapado pelo banner de cookies em visitantes novos.

Para adicionar comunicado: acrescentar entrada com `slug` único em `siteData.ts` — `data` no formato `DD/MM/YYYY`.

---

## Calendário (`/calendario` → `src/pages/Calendario.tsx`)

Grelha com todos os jogos da equipa sénior. Dados: `games[]` em `src/data/siteData.ts` (interface `Game`, helper `parseGameDateTime()`). Estado de cada jogo (`upcoming` / `countdown` / `live` / `ended`) calculado em `src/lib/games.ts` (`getGameStatus()`, `getNextGame()`, hook `useNow()` que actualiza a cada segundo).

Jogos terminados (`ended`) ficam a cinzento/grayscale; mostram o resultado se `game.result` estiver preenchido, senão "Resultado brevemente" — resultados são sempre inseridos à mão em `siteData.ts`, não há cálculo automático. Só jogos em casa (`isHome: true`) têm `youtubeUrl`; jogos fora mostram o indicador "Ao Vivo" sem transmissão.

Sem link na nav principal — acedida via botão "Ver Calendário" na `EventsSection` da homepage.

