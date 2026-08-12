import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { games, parseGameDateTime, formatGameTime, getMatchupNames } from '@/data/siteData';
import { getNextGame, getGameStatus, formatCountdown, useNow } from '@/lib/games';

function NextGameFeature() {
  const now = useNow(1000);
  const nextGame = getNextGame(games, now);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!nextGame) {
    return (
      <div className="max-w-xl mx-auto text-center bg-gray-100 dark:bg-gray-800 rounded-2xl p-10">
        <p className="text-gray-500 dark:text-gray-400">Sem jogos agendados de momento.</p>
      </div>
    );
  }

  const status = getGameStatus(nextGame, now);
  const start = parseGameDateTime(nextGame);
  const dateLabel = start.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' });
  const timeLabel = formatGameTime(nextGame);
  const matchup = getMatchupNames(nextGame);
  const canWatch = status === 'live' && nextGame.isHome && !!nextGame.youtubeUrl;
  const isLiveAway = status === 'live' && !nextGame.isHome;

  return (
    <>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ y: -4, scale: 1.02, rotateY: 2 }}
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
              <span className="text-xs font-bold uppercase tracking-widest text-primary/80">{nextGame.competition}</span>
              {status === 'live' ? (
                <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  A Decorrer
                </span>
              ) : (
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  {nextGame.isHome ? 'Em Casa' : 'Fora'}
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

            {status === 'countdown' && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3.5 text-center">
                <p className="text-red-400 text-[11px] font-bold uppercase tracking-widest mb-1">Começa em</p>
                <p className="text-white font-heading font-black text-2xl tabular-nums">{formatCountdown(start, now)}</p>
              </div>
            )}

            {canWatch && (
              <button
                onClick={() => setConfirmOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-heading font-black uppercase tracking-wider text-sm py-3.5 rounded-xl transition-colors animate-pulse"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white" />
                Ver Ao Vivo no YouTube
              </button>
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

      {canWatch && nextGame.youtubeUrl && (
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Vai sair do site do HC PDL</DialogTitle>
              <DialogDescription>A transmissão em direto abre numa nova janela do YouTube.</DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-end gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
              <Button type="button" asChild>
                <a
                  href={nextGame.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setConfirmOpen(false)}
                >
                  Continuar
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export const EventsSection = () => (
  <motion.section
    id="events"
    className="py-20 bg-white dark:bg-gray-900"
    initial={{ opacity: 0, y: 40, rotateX: 3 }}
    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
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
