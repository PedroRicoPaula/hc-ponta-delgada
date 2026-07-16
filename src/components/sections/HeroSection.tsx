import { motion } from 'framer-motion';
import { useRef } from 'react';
import { games, parseGameDateTime } from '@/data/siteData';
import { getNextGame, getGameStatus, useNow } from '@/lib/games';

function NextGameCard() {
  const now = useNow(1000);
  const nextGame = getNextGame(games, now);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  if (!nextGame) return null;

  const isLive = getGameStatus(nextGame, now) === 'live';
  const start = parseGameDateTime(nextGame);
  const date = start.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' });
  const time = start.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      className="absolute top-[38%] -translate-y-1/2 left-[46%] -translate-x-1/2 z-20 w-[240px]"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
        whileHover={{ scale: 1.03, rotateY: 4, rotateX: -3 }}
        style={{ transformPerspective: 700 }}
        className="group relative rounded-xl"
      >
        {/* Glow that follows the cursor along the border */}
        <div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(180px circle at var(--mx, 50%) var(--my, 50%), rgba(255,194,0,0.8), transparent 70%)',
          }}
        />
        <div className="relative bg-black/65 backdrop-blur-md border border-white/10 rounded-xl p-4 overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            {isLive ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
                A Decorrer
              </span>
            ) : (
              <span className="text-xs font-bold uppercase tracking-widest text-primary/80">Próximo Jogo</span>
            )}
          </div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="font-heading font-black text-white text-sm uppercase leading-tight">HC PDL</span>
            <span className="text-primary font-black text-xs px-2">VS</span>
            <span className="font-heading font-black text-white text-sm uppercase leading-tight text-right">{nextGame.opponent}</span>
          </div>
          <div className="border-t border-white/10 pt-2.5 space-y-1">
            <p className="text-gray-300 text-xs font-medium">{date} · {time}</p>
            <p className="text-gray-500 text-xs">{nextGame.location} · {nextGame.competition}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export const HeroSection = () => (
  <header className="relative bg-white dark:bg-[#0a0a0a] min-h-[100svh] flex items-center overflow-hidden">
    {/* Subtle radial glow */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse 70% 60% at 30% 50%, rgba(255,194,0,0.08) 0%, transparent 70%)' }}
    />

    <div className="relative w-full grid md:grid-cols-2 items-center pt-16">
      {/* Left: text */}
      <div className="flex flex-col justify-center px-10 sm:px-14 md:px-16 lg:px-24 py-16">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary mb-6"
        >
          <span className="w-8 h-px bg-primary" />
          Hóquei em Patins · Açores
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="font-heading uppercase leading-none mb-8"
          style={{ fontSize: 'clamp(4rem, 12vw, 9rem)', letterSpacing: '-0.03em' }}
        >
          <span className="block text-primary">Hóquei</span>
          <span className="block text-primary">Clube</span>
          <span className="block text-gray-900 dark:text-white">PDL</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed mb-10 max-w-sm"
        >
          Paixão, Orgulho e Excelência desde 2012. Representamos os Açores no hóquei em patins nacional.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex items-center gap-4"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/30">Fundado em 2012</span>
          <span className="w-px h-4 bg-gray-300 dark:bg-white/20" />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/30">São Miguel, Açores</span>
        </motion.div>
      </div>

      {/* Right: team photo + Next Game card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="relative hidden md:block h-[100svh]"
      >
        <img
          src="/uploads/PDL24-25V2.png"
          alt="Equipa sénior do Hóquei Clube Ponta Delgada"
          className="w-full h-full object-cover object-center"
          style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)' }}
          loading="eager"
        />
        {/* Fade overlay — blends photo edge into the text panel's base colour per theme */}
        <div
          className="absolute inset-0 pointer-events-none dark:hidden"
          style={{ background: 'linear-gradient(to right, #ffffff 0%, transparent 35%)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none hidden dark:block"
          style={{ background: 'linear-gradient(to right, #0a0a0a 0%, transparent 35%)' }}
        />
        <NextGameCard />
      </motion.div>
    </div>

    {/* Bottom gold diagonal */}
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-10" style={{ height: 60 }}>
      <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="w-full h-full">
        <polygon points="0,60 100,0 100,60" fill="#FFC200" />
      </svg>
    </div>
  </header>
);
