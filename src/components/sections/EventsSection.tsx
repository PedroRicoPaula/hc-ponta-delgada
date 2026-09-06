import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LiveBroadcast } from '@/components/LiveBroadcast';
import { GameCard } from '@/components/GameCard';
import { FORMACAO_ESCALOES, games, parseGameDateTime, formatGameTime, getMatchupNames, playsAtHomePavilion, isNationalChampionship, type FormacaoEscalao } from '@/data/siteData';
import { getNextGame, getGameStatus, isBroadcastWindow, isMatchLive, formatCountdown, senioresGames, formacaoGames, useNow } from '@/lib/games';

function NextGameFeature() {
  const now = useNow(1000);
  const nextGame = getNextGame(senioresGames(games), now);

  if (!nextGame) {
    return (
      <div className="max-w-xl mx-auto text-center bg-gray-100 dark:bg-gray-800 rounded-2xl p-10">
        <p className="text-gray-500 dark:text-gray-400">Sem jogos seniores agendados de momento.</p>
      </div>
    );
  }

  const status = getGameStatus(nextGame, now);
  const live = isMatchLive(nextGame, now);
  const canWatch = isBroadcastWindow(nextGame, now);
  const isLiveAway = live && !nextGame.youtubeUrl;
  const start = parseGameDateTime(nextGame);
  const dateLabel = start.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' });
  const timeLabel = formatGameTime(nextGame);
  const matchup = getMatchupNames(nextGame);

  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={canWatch ? undefined : { y: -4, scale: 1.02, rotateY: 2 }}
      style={{ transformPerspective: 800 }}
      className="max-w-xl mx-auto"
    >
      <div className="relative bg-gray-950 dark:bg-black border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden">
        <div
          className="pointer-events-none absolute -inset-1"
          style={{ background: 'radial-gradient(circle at 30% 0%, rgba(255,194,0,0.16), transparent 60%)' }}
        />

        <div className="relative">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between mb-6">
            <span className={`text-xs font-bold uppercase tracking-widest ${isNationalChampionship(nextGame) ? 'text-primary' : 'text-primary/80'}`}>{nextGame.competition}</span>
            {live ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                A Decorrer
              </span>
            ) : (
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                {playsAtHomePavilion(nextGame) ? 'Em Casa' : 'Fora'}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 mb-6 text-center">
            <span className="font-heading font-black text-white text-2xl sm:text-3xl uppercase leading-tight break-words">{matchup.home}</span>
            <span className="text-primary font-black text-xs uppercase tracking-widest">vs</span>
            <span className="font-heading font-black text-white text-2xl sm:text-3xl uppercase leading-tight break-words">
              {matchup.away}
            </span>
          </div>

          <div className="border-t border-white/10 pt-4 mb-6">
            <p className="text-gray-300 text-sm font-semibold">{dateLabel} · {timeLabel}</p>
            <p className="text-gray-500 text-xs mt-1">{nextGame.location}</p>
          </div>

          {status === 'countdown' && !canWatch && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3.5 text-center">
              <p className="text-red-400 text-[11px] font-bold uppercase tracking-widest mb-1">Começa em</p>
              <p className="text-white font-heading font-black text-2xl tabular-nums">{formatCountdown(start, now)}</p>
            </div>
          )}

          {canWatch && nextGame.youtubeUrl && (
            <LiveBroadcast
              url={nextGame.youtubeUrl}
              title={`${matchup.home} vs ${matchup.away} — ao vivo`}
            />
          )}

          {isLiveAway && (
            <div className="flex items-center justify-center gap-2 text-red-400 text-xs font-bold uppercase tracking-widest text-center">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
              A decorrer · sem transmissão (jogo fora)
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function FormacaoEmptyCard({ escalao }: { escalao: FormacaoEscalao }) {
  return (
    <article className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900/40">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">{escalao}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">A anunciar</p>
    </article>
  );
}

export const EventsSection = () => {
  const now = useNow(1000);

  return (
    <motion.section
      id="events"
      className="py-20 bg-white dark:bg-gray-900"
      initial={{ opacity: 0, y: 40, rotateX: 3 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      style={{ transformPerspective: 1200 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/70 mb-3">
          <span className="w-5 h-px bg-primary/50" />
          03 — Calendário
        </p>
        <h2 className="font-heading text-5xl md:text-6xl uppercase leading-none mb-10 text-gray-900 dark:text-white">
          Próximos <span className="text-primary">Jogos</span>
        </h2>

        <NextGameFeature />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto mt-8">
          {FORMACAO_ESCALOES.map((escalao, i) => {
            const next = getNextGame(formacaoGames(games, escalao), now);
            return next
              ? <GameCard key={escalao} game={next} now={now} index={i} compact />
              : <FormacaoEmptyCard key={escalao} escalao={escalao} />;
          })}
        </div>

        <div className="flex justify-center mt-10">
          <Link
            to="/calendario"
            className="inline-flex items-center gap-2 bg-primary text-gray-950 hover:bg-primary/90 px-6 py-3 font-heading font-black text-xs uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5"
          >
            Ver Calendário
          </Link>
        </div>
      </div>
    </motion.section>
  );
};
