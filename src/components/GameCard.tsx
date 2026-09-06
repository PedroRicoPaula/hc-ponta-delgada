import { motion } from 'framer-motion';
import { parseGameDateTime, formatGameTime, getMatchupNames, playsAtHomePavilion, isNationalChampionship, type Game } from '@/data/siteData';
import { getGameStatus, isBroadcastWindow, isMatchLive } from '@/lib/games';
import { cn } from '@/lib/utils';

export function GameCard({
  game,
  now,
  index,
  showBroadcastHint = false,
  compact = false,
}: {
  game: Game;
  now: Date;
  index: number;
  showBroadcastHint?: boolean;
  compact?: boolean;
}) {
  const status = getGameStatus(game, now);
  const isEnded = status === 'ended';
  const isLive = isMatchLive(game, now);
  const canWatch = isBroadcastWindow(game, now);
  const start = parseGameDateTime(game);
  const dateLabel = start.toLocaleDateString('pt-PT', compact
    ? { day: 'numeric', month: 'short' }
    : { day: 'numeric', month: 'short', year: 'numeric' });
  const timeLabel = formatGameTime(game);
  const matchup = getMatchupNames(game);
  const atHome = playsAtHomePavilion(game);
  const national = isNationalChampionship(game);
  const title = compact && game.escalao ? game.escalao : (game.escalao ? `${game.escalao} · ${game.competition}` : game.competition);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.5 }}
      whileHover={isEnded ? undefined : { y: -4, scale: 1.02 }}
      style={{ transformPerspective: 600 }}
      className={`rounded-2xl border ${compact ? 'p-3' : 'p-5'} ${
        isEnded
          ? 'bg-gray-100 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800 opacity-60 grayscale'
          : isLive
          ? 'bg-white dark:bg-gray-800/50 border-red-400 dark:border-red-500/60 shadow-md'
          : 'bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-700'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={cn(
          'text-[11px] font-bold uppercase tracking-widest',
          national ? 'text-primary' : 'text-gray-400 dark:text-gray-500',
        )}>
          {title}
        </span>
        {isLive ? (
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-red-500 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Ao Vivo
          </span>
        ) : (
          <span className={`text-[11px] font-bold uppercase tracking-widest ${atHome ? 'text-primary/80' : 'text-gray-400 dark:text-gray-500'}`}>
            {atHome ? 'Casa' : 'Fora'}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 mb-3">
        <span className={cn('font-heading font-black text-gray-900 dark:text-white uppercase leading-tight', compact ? 'text-xs' : 'text-sm')}>
          {matchup.home}
        </span>
        <span className="text-primary font-black text-xs px-1 flex-shrink-0">VS</span>
        <span className={cn('font-heading font-black text-gray-900 dark:text-white uppercase leading-tight text-right', compact ? 'text-xs' : 'text-sm')}>
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

      {isLive && !game.youtubeUrl && (
        <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-500 italic">Sem transmissão · jogo fora</p>
      )}
      {canWatch && showBroadcastHint && (
        <p className="mt-2 text-[11px] font-bold uppercase tracking-widest text-red-500">Transmissão acima</p>
      )}
    </motion.article>
  );
}
