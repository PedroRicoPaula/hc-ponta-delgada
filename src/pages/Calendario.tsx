import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SocialIcons } from '@/components/SocialIcons';
import { games, parseGameDateTime, formatGameTime, hasKnownTime, getMatchupNames, type Game } from '@/data/siteData';
import { getGameStatus, useNow } from '@/lib/games';

/** DD/MM/YYYY → YYYY-MM-DD, para startDate sem hora no schema.org. */
const toIsoDate = (date: string) => date.split('/').reverse().join('-');

/**
 * startDate para o schema, como hora local do recinto (sem "Z" nem offset).
 *
 * Não usar `parseGameDateTime(game).toISOString()`: isso converte para UTC
 * usando o fuso de quem corre o código, e este schema é gerado no build. A
 * máquina de desenvolvimento está nos Açores (UTC−1 no inverno) e o container
 * de build do Cloudflare corre em UTC, por isso o mesmo jogo saía com horas
 * diferentes conforme onde o build corresse — 19:00 aqui, 18:00 lá.
 *
 * O schema.org aceita hora local sem offset e interpreta-a como hora do local
 * do evento, que é exactamente o que a FPP publica.
 */
const toSchemaStartDate = (game: Game) =>
  hasKnownTime(game) ? `${toIsoDate(game.date)}T${game.time}` : toIsoDate(game.date);

function GameCard({ game, now, index }: { game: Game; now: Date; index: number }) {
  const status = getGameStatus(game, now);
  const isEnded = status === 'ended';
  const isLive = status === 'live';
  const start = parseGameDateTime(game);
  const dateLabel = start.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeLabel = formatGameTime(game);
  const matchup = getMatchupNames(game);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.5 }}
      whileHover={isEnded ? undefined : { y: -4, scale: 1.02 }}
      style={{ transformPerspective: 600 }}
      className={`rounded-2xl border p-5 ${
        isEnded
          ? 'bg-gray-100 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800 opacity-60 grayscale'
          : isLive
          ? 'bg-white dark:bg-gray-800/50 border-red-400 dark:border-red-500/60 shadow-md'
          : 'bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-700'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          {game.competition}
        </span>
        {isLive ? (
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-red-500 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Ao Vivo
          </span>
        ) : (
          <span className={`text-[11px] font-bold uppercase tracking-widest ${game.isHome ? 'text-primary/80' : 'text-gray-400 dark:text-gray-500'}`}>
            {game.isHome ? 'Casa' : 'Fora'}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="font-heading font-black text-gray-900 dark:text-white text-sm uppercase leading-tight">
          {matchup.home}
        </span>
        <span className="text-primary font-black text-xs px-1 flex-shrink-0">VS</span>
        <span className="font-heading font-black text-gray-900 dark:text-white text-sm uppercase leading-tight text-right">
          {matchup.away}
        </span>
      </div>

      {isEnded && game.result ? (
        <div className="text-center py-2 mb-3 bg-gray-200/60 dark:bg-gray-800 rounded-lg">
          <span className="font-heading font-black text-xl text-gray-700 dark:text-gray-300 tabular-nums">
            {game.result.home} - {game.result.away}
          </span>
        </div>
      ) : isEnded ? (
        <p className="text-center text-[11px] text-gray-400 dark:text-gray-500 mb-3 italic">Resultado brevemente</p>
      ) : null}

      <div className="border-t border-gray-100 dark:border-gray-700 pt-2.5 space-y-0.5">
        <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">{dateLabel} · {timeLabel}</p>
        <p className="text-gray-400 dark:text-gray-500 text-xs">{game.location}</p>
      </div>

      {isLive && !game.isHome && (
        <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-500 italic">Sem transmissão · jogo fora</p>
      )}
    </motion.article>
  );
}

export default function Calendario() {
  const now = useNow(1000);
  const sorted = [...games].sort((a, b) => parseGameDateTime(a).getTime() - parseGameDateTime(b).getTime());

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Calendário de Jogos — Hóquei Clube PDL | Próximos Jogos e Resultados</title>
        <meta name="description" content="Calendário completo de jogos do Hóquei Clube PDL (Açores) — próximos jogos, transmissões ao vivo no YouTube e resultados do Campeonato Nacional." />
        <link rel="canonical" href="https://hoqueiclubepdl.com/calendario/" />
        <meta property="og:title" content="Calendário de Jogos — Hóquei Clube PDL" />
        <meta property="og:description" content="Calendário completo de jogos do Hóquei Clube PDL — próximos jogos, transmissões ao vivo e resultados do Campeonato Nacional de Hóquei em Patins." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hoqueiclubepdl.com/calendario/" />
        <script type="application/ld+json">{JSON.stringify(
          sorted.map(game => ({
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            "name": `${getMatchupNames(game).home} vs ${getMatchupNames(game).away}`,
            // Sem hora marcada, schema.org aceita startDate só com a data. Publicar
            // o fallback de meia-noite como se fosse hora oficial daria a entender
            // que o jogo é às 00:00 — e é isso que apareceria em resultados de
            // pesquisa e assistentes de IA.
            "startDate": toSchemaStartDate(game),
            "eventStatus": "https://schema.org/EventScheduled",
            "location": {
              "@type": "Place",
              "name": game.location,
              "address": game.isHome
                ? { "@type": "PostalAddress", "streetAddress": "Rua do Mercado, 31", "addressLocality": "Ponta Delgada", "postalCode": "9500-326", "addressRegion": "Açores", "addressCountry": "PT" }
                : { "@type": "PostalAddress", "addressCountry": "PT" }
            },
            "homeTeam": {
              "@type": "SportsTeam",
              "name": game.isHome ? "Hóquei Clube PDL" : game.opponent,
              ...(game.isHome ? { "url": "https://hoqueiclubepdl.com/" } : {})
            },
            "awayTeam": {
              "@type": "SportsTeam",
              "name": game.isHome ? game.opponent : "Hóquei Clube PDL",
              ...(!game.isHome ? { "url": "https://hoqueiclubepdl.com/" } : {})
            },
            "sport": "Hóquei em Patins",
            "description": `Jogo do Campeonato Nacional — ${game.competition}. ${game.isHome ? "Jogo em casa no Pavilhão Sidório Serpa, Ponta Delgada." : `Jogo fora em ${game.location}.`}`,
            "organizer": { "@type": "Organization", "name": "Federação de Patinagem de Portugal", "alternateName": "FPP" },
            // Resultado e nome da transmissão pela mesma ordem casa-fora usada no
            // cartão, para o placar bater certo com os nomes.
            ...(game.result ? { "result": `${getMatchupNames(game).home} ${game.result.home} - ${game.result.away} ${getMatchupNames(game).away}` } : {}),
            ...(game.youtubeUrl ? { "recordedIn": { "@type": "VideoObject", "name": `${getMatchupNames(game).home} vs ${getMatchupNames(game).away} — Ao Vivo`, "url": game.youtubeUrl } } : {})
          }))
        )}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://hoqueiclubepdl.com/" },
            { "@type": "ListItem", "position": 2, "name": "Calendário", "item": "https://hoqueiclubepdl.com/calendario" }
          ]
        })}</script>
      </Helmet>

      <Navigation />
      <SocialIcons />

      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 mb-4">
              <Calendar className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3">Calendário</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Todos os jogos da equipa sénior. Jogos em casa têm transmissão em direto no YouTube — assim que terminam,
              o resultado é adicionado manualmente.
            </p>
          </motion.div>

          {sorted.length === 0 ? (
            <p className="text-center text-gray-400 py-16">Nenhum jogo agendado.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.map((game, i) => (
                <GameCard key={game.id} game={game} now={now} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
