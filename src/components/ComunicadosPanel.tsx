import { X } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Comunicado } from "@/data/siteData";

interface ComunicadosPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data: Comunicado[];
}

export const ComunicadosPanel = ({ isOpen, onClose, data }: ComunicadosPanelProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-[60]"
            role="dialog"
            aria-modal="true"
            aria-label="Comunicados"
          >
        <div className="p-6 relative h-full">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            aria-label="Fechar comunicados"
          >
            <X className="h-6 w-6" />
          </button>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Comunicados</h2>
          <div className="h-[calc(100%-50px)] overflow-y-auto pr-2 space-y-4 pb-2">
            {data.map((comunicado) => (
              <div
                key={comunicado.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition bg-gray-50 dark:bg-gray-800 flex flex-col"
              >
                <Link to={`/comunicados/${comunicado.slug}`} onClick={onClose}>
                  <h3 className="text-lg font-semibold text-primary mb-1 hover:text-primary/80 transition-colors">
                    {comunicado.titulo}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{comunicado.data}</p>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3 line-clamp-3">
                  {comunicado.conteudo}
                </p>
                <div className="flex gap-2 mt-auto">
                  <Link
                    to={`/comunicados/${comunicado.slug}`}
                    onClick={onClose}
                    className="inline-flex items-center justify-center flex-1 px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-gray-950 transition-all duration-200 font-heading font-black text-xs uppercase tracking-wider"
                  >
                    Ler mais
                  </Link>
                  {comunicado.pdfUrl && (
                    <a
                      href={comunicado.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center flex-1 px-4 py-2 bg-primary text-gray-950 hover:bg-primary/90 transition-colors font-heading font-black text-xs uppercase tracking-wider"
                    >
                      PDF
                    </a>
                  )}
                </div>
              </div>
            ))}
            <Link
              to="/comunicados"
              onClick={onClose}
              className="block text-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors py-2"
            >
              Ver todos os comunicados →
            </Link>
          </div>
        </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};