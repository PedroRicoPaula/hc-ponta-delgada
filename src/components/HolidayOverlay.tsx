import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import "./HolidayOverlay.css";

interface Snowflake {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  driftStart: number;
  driftEnd: number;
  spinDuration: number;
  spinDirection: number;
}

const SnowfallOverlay = () => {
  // useMemo garante que os flocos são calculados apenas uma vez
  const snowflakes = useMemo<Snowflake[]>(() => {
    // Reduzido para 75 para garantir fluidez máxima (60fps)
    const count = 75; 
    
    return Array.from({ length: count }, (_, id) => {
      const size = 12 + Math.random() * 14; // Tamanho ligeiramente maior para compensar haver menos quantidade
      const driftStart = (Math.random() - 0.5) * 550; // Movimento lateral
      const driftEnd = driftStart * -1;

      return {
        id,
        left: Math.random() * 100,
        size,
        duration: 8 + Math.random() * 12, // Velocidade de queda
        // Delay negativo importante: a neve já começa "a meio" da queda
        delay: Math.random() * -20, 
        opacity: 0.4 + Math.random() * 0.5,
        driftStart,
        driftEnd,
        spinDuration: 10 + Math.random() * 15,
        spinDirection: Math.random() > 0.5 ? 1 : -1,
      };
    });
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9990] overflow-hidden select-none">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
            // Passagem de variáveis para o CSS lidar com a animação
            "--drift-start": `${flake.driftStart}px`,
            "--drift-end": `${flake.driftEnd}px`,
          } as React.CSSProperties}
        >
          <div
            className="snowflake-shape"
            style={{
              animationDuration: `${flake.spinDuration}s`,
              animationDirection: flake.spinDirection > 0 ? "normal" : "reverse",
            }}
          />
        </div>
      ))}
    </div>
  );
};

interface HolidayPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const HolidayPopup = ({ isOpen, onClose }: HolidayPopupProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        aria-modal="true"
        role="dialog"
        aria-label="Boas Festas"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-xl"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute -right-3 -top-3 rounded-full bg-white text-gray-800 shadow-lg transition hover:bg-gray-100 p-2 z-10"
            aria-label="Fechar mensagem de Natal"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src="/lovable-uploads/Natal2025.jpeg"
            alt="Boas festas do Hóquei Clube Ponta Delgada"
            className="mx-auto block w-full rounded-2xl border-2 border-white/20 shadow-2xl"
            loading="eager"
            decoding="async"
          />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const HolidayOverlay = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(true);

  useEffect(() => {
    if (!isPopupOpen) {
      return undefined;
    }

    const timerId = window.setTimeout(() => setIsPopupOpen(false), 15000);
    return () => window.clearTimeout(timerId);
  }, [isPopupOpen]);

  return (
    <>
      <SnowfallOverlay />
      <HolidayPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </>
  );
};

export default HolidayOverlay;