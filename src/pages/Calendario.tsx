import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SocialIcons } from '@/components/SocialIcons';
import { GameCard } from '@/components/GameCard';
import {
  games,
  parseGameDateTime,
  hasKnownTime,
  getMatchupNames,
  FORMACAO_ESCALOES,
  type Game,
  type GameCategory,
  type FormacaoEscalao,
} from '@/data/siteData';
import { isBroadcastWindow, senioresGames, formacaoGames, useNow } from '@/lib/games';
import { LiveBroadcast } from '@/components/LiveBroadcast';
import { cn } from '@/lib/utils';

const toIsoDate = (date: string) => date.split('/').reverse().join('-');

const toSchemaStartDate = (game: Game) =>
  hasKnownTime(game) ? `${toIsoDate(game.date)}T${game.time}` : toIsoDate(game.date);

function SwitchRow<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex flex-wrap justify-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-800"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-3 sm:px-4 py-2 font-heading font-black text-xs uppercase tracking-wider transition-colors',
            value === opt.value
              ? 'bg-primary text-gray-950'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function Calendario() {
  const now = useNow(1000);
  const [category, setCategory] = useState<GameCategory>('seniores');
  const [escalao, setEscalao] = useState<FormacaoEscalao>('Sub 17');

  const visible =
    category === 'seniores'
      ? senioresGames(games).sort((a, b) => parseGameDateTime(a).getTime() - parseGameDateTime(b).getTime())
      : formacaoGames(games, escalao).sort((a, b) => parseGameDateTime(a).getTime() - parseGameDateTime(b).getTime());

  const onAir = games.find((game) => isBroadcastWindow(game, now));
  const schemaGames = [...games].sort((a, b) => parseGameDateTime(a).getTime() - parseGameDateTime(b).getTime());

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Calendário de Jogos — Hóquei Clube PDL | Seniores e Formação</title>
        <meta name="description" content="Calendário de jogos do Hóquei Clube PDL (Açores) — seniores, formação, transmissões ao vivo no YouTube e resultados." />
        <link rel="canonical" href="https://hoqueiclubepdl.com/calendario/" />
        <meta property="og:title" content="Calendário de Jogos — Hóquei Clube PDL" />
        <meta property="og:description" content="Calendário de jogos do Hóquei Clube PDL — seniores, formação, transmissões ao vivo e resultados." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hoqueiclubepdl.com/calendario/" />
        <script type="application/ld+json">{JSON.stringify(
          schemaGames.map(game => ({
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            "name": `${getMatchupNames(game).home} vs ${getMatchupNames(game).away}`,
            "startDate": toSchemaStartDate(game),
            "eventStatus": "https://schema.org/EventScheduled",
            "location": {
              "@type": "Place",
              "name": game.location,
              "address": game.location === 'Pavilhão Sidónio Serpa'
                ? { "@type": "PostalAddress", "streetAddress": "Rua do Mercado, 31", "addressLocality": "Ponta Delgada", "postalCode": "9500-326", "addressRegion": "Açores", "addressCountry": "PT" }
                : game.location === 'Pavilhão Municipal Carlos Silveira'
                ? { "@type": "PostalAddress", "addressLocality": "Ponta Delgada", "addressRegion": "Açores", "addressCountry": "PT" }
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
            "description": `${game.competition}. Jogo em ${game.location}.`,
            "organizer": { "@type": "Organization", "name": game.competition.includes('Campeonato Nacional') ? "Federação de Patinagem de Portugal" : "Hóquei Clube PDL" },
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
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 mb-4">
              <Calendar className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3">Calendário</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-8">
              Seniores e formação. Jogos em casa no Sidónio Serpa têm transmissão no YouTube no site, um minuto antes do início.
            </p>
            <div className="flex flex-col items-center gap-3">
              <SwitchRow
                ariaLabel="Equipa"
                value={category}
                onChange={setCategory}
                options={[
                  { value: 'seniores', label: 'Seniores' },
                  { value: 'formacao', label: 'Formação' },
                ]}
              />
              {category === 'formacao' && (
                <SwitchRow
                  ariaLabel="Escalão"
                  value={escalao}
                  onChange={setEscalao}
                  options={FORMACAO_ESCALOES.map((e) => ({ value: e, label: e }))}
                />
              )}
            </div>
          </motion.div>

          {onAir?.youtubeUrl && (
            <div className="max-w-3xl mx-auto mb-12">
              <LiveBroadcast
                url={onAir.youtubeUrl}
                title={`${getMatchupNames(onAir).home} vs ${getMatchupNames(onAir).away} — ao vivo`}
              />
            </div>
          )}

          {visible.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500 py-16">
              {category === 'formacao'
                ? `Calendário de ${escalao} a anunciar.`
                : 'Nenhum jogo agendado.'}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((game, i) => (
                <GameCard key={game.id} game={game} now={now} index={i} showBroadcastHint />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
