import { Gamepad2 } from "lucide-react";

interface FloatingActionButtonsProps {
  onOpenGame: () => void;
}

export const FloatingActionButtons = ({ onOpenGame }: FloatingActionButtonsProps) => (
  <button
    onClick={onOpenGame}
    className="fixed right-4 top-[68%] sm:top-1/2 -translate-y-1/2 z-40 bg-gradient-to-b from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground p-2 sm:p-3 rounded-l-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-x-1 group"
    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
    aria-label="Abrir mini jogo"
  >
    <div className="flex flex-col items-center gap-2">
      <Gamepad2 className="h-5 w-5 sm:h-6 sm:w-6 group-hover:animate-pulse" />
      <span className="hidden sm:block font-semibold text-sm tracking-wide">MINI JOGO</span>
    </div>
  </button>
);
