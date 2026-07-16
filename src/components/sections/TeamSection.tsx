import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { BarChart3, ExternalLink, Trophy, X } from 'lucide-react';
import { players, Player } from '@/data/siteData';

const sectionVariants = {
  hidden: { opacity: 0, y: 40, rotateX: 3 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }
};

const positionColors: Record<string, string> = {
  "Guarda-Redes": "from-blue-900 to-blue-700",
  "Defesa":       "from-green-900 to-green-700",
  "Médio":        "from-purple-900 to-purple-700",
  "Avançado":     "from-red-900 to-red-700",
  "Universal":    "from-yellow-800 to-yellow-600",
};

const positionBadge: Record<string, string> = {
  "Guarda-Redes": "bg-blue-100 text-blue-800",
  "Defesa":       "bg-green-100 text-green-800",
  "Médio":        "bg-purple-100 text-purple-800",
  "Avançado":     "bg-red-100 text-red-800",
  "Universal":    "bg-yellow-100 text-yellow-800",
};

const nationalityFlags: Record<string, string> = {
  PT: "🇵🇹",
};

interface ConfirmationDetails {
  isOpen: boolean;
  title: string;
  description: string;
  url: string;
}

function PlayerCard({ player }: { player: Player }) {
  const [flipped, setFlipped] = useState(false);
  const grad = positionColors[player.position] ?? "from-gray-800 to-gray-600";
  const badge = positionBadge[player.position] ?? "bg-gray-100 text-gray-800";

  return (
    <motion.div
      layout
      className="relative rounded-xl overflow-hidden cursor-pointer select-none shadow-sm"
      style={{ aspectRatio: '2/3', transformPerspective: 600 }}
      onClick={() => setFlipped(v => !v)}
      whileHover={{ y: -4, scale: 1.02, rotateY: 2, boxShadow: '0 12px 32px rgba(0,0,0,0.18)' }}
      transition={{ layout: { duration: 0.3, ease: 'easeInOut' } }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!flipped ? (
          /* FRONT: photo full-bleed (or gradient) with number + name overlay */
          <motion.div
            key="front"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {player.photo ? (
              <>
                <img src={player.photo} alt={player.name} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </>
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${grad} flex items-center justify-center`}>
                <span className="text-white/15 font-black select-none" style={{ fontSize: '4rem', lineHeight: 1 }}>
                  {player.number}
                </span>
              </div>
            )}
            <span className="absolute top-1.5 right-2 text-white/40 font-black leading-none select-none" style={{ fontSize: '2rem' }}>
              {player.number}
            </span>
            <div className="absolute bottom-0 left-0 right-0 p-2.5">
              <p className="text-white font-bold text-xs leading-tight">{player.name}</p>
              <span className={`mt-0.5 inline-block px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${badge}`}>
                {player.position}
              </span>
            </div>
          </motion.div>
        ) : (
          /* BACK: small avatar + stats grid */
          <motion.div
            key="back"
            className="absolute inset-0 bg-white dark:bg-gray-800 flex flex-col p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={(e) => { e.stopPropagation(); setFlipped(false); }}
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              {player.photo ? (
                <img src={player.photo} alt={player.name} className="w-10 h-10 rounded-full object-cover border-2 border-primary flex-shrink-0" />
              ) : (
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white font-black text-base flex-shrink-0`}>
                  {player.number}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-xs text-gray-900 dark:text-white leading-tight truncate">{player.name}</p>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${badge}`}>
                  {player.position}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1 flex-1 content-center">
              {(player.position === "Guarda-Redes"
                ? [
                    { label: "J", value: player.stats.games },
                    { label: "P", value: player.stats.penaltySaves ?? 0 },
                    { label: "L", value: player.stats.freeHitSaves ?? 0 },
                    { label: "Idade", value: player.stats.age },
                    { label: "Nac.", value: nationalityFlags[player.stats.nationality] ?? player.stats.nationality },
                  ]
                : [
                    { label: "J", value: player.stats.games },
                    { label: "Golos", value: player.stats.goals },
                    { label: "Assist.", value: player.stats.assists },
                    { label: "Idade", value: player.stats.age },
                    { label: "Nac.", value: nationalityFlags[player.stats.nationality] ?? player.stats.nationality },
                  ]
              ).map(({ label, value }) => (
                <div key={label} className="aspect-square bg-gray-50 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center gap-0.5">
                  <p className="text-gray-400 dark:text-gray-500 text-[9px] uppercase font-semibold">{label}</p>
                  <p className="text-gray-900 dark:text-white font-bold text-sm">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export const TeamSection = () => {
  const [confirmationDetails, setConfirmationDetails] = useState<ConfirmationDetails>({
    isOpen: false, title: '', description: '', url: ''
  });

  const handleOpenConfirmation = (type: 'stats' | 'classification') => {
    setConfirmationDetails(type === 'stats' ? {
      isOpen: true,
      title: 'Ver Estatísticas e Resultados',
      description: 'Está prestes a ser redirecionado para o site da FPP para ver as estatísticas da equipa. Deseja continuar?',
      url: 'https://hp.fpp.pt/Equipa/414/804'
    } : {
      isOpen: true,
      title: 'Ver Classificação',
      description: 'Está prestes a ser redirecionado para o site da FPP para ver a classificação do campeonato. Deseja continuar?',
      url: 'https://hp.fpp.pt/Classificacao/414'
    });
  };

  const handleCloseConfirmation = () => {
    setConfirmationDetails({ isOpen: false, title: '', description: '', url: '' });
  };

  return (
    <>
      <motion.section
        id="team"
        className="py-20 bg-white dark:bg-gray-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
        style={{ transformPerspective: 1200 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/70 mb-3">
            <span className="w-5 h-px bg-primary/50" />
            04 — Plantel
          </p>
          <h2 className="font-heading text-5xl md:text-6xl uppercase leading-none mb-2 text-gray-900 dark:text-white">
            A Nossa <span className="text-primary">Equipa</span>
          </h2>
          <p className="text-gray-400 text-sm mb-8">Clica em cada card para ver as estatísticas do atleta</p>

          <motion.div
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          >
            {players.map((player) => (
              <PlayerCard key={player.number} player={player} />
            ))}
          </motion.div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
            <button
              onClick={() => handleOpenConfirmation('stats')}
              className="inline-flex items-center gap-2 bg-primary text-gray-950 hover:bg-primary/90 px-6 py-3 font-heading font-black text-sm uppercase tracking-wider transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              Estatísticas e Resultados
            </button>
            <button
              onClick={() => handleOpenConfirmation('classification')}
              className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-gray-950 px-6 py-3 font-heading font-black text-sm uppercase tracking-widest transition-all duration-200"
            >
              <Trophy className="h-4 w-4" />
              Ver Classificação
            </button>
          </div>
        </div>
      </motion.section>

      <Dialog open={confirmationDetails.isOpen} onOpenChange={handleCloseConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{confirmationDetails.title}</DialogTitle>
            <DialogDescription>{confirmationDetails.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleCloseConfirmation}>Cancelar</Button>
            <Button type="button" asChild>
              <a href={confirmationDetails.url} target="_blank" rel="noopener noreferrer">
                Continuar
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
