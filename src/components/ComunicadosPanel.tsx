import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Comunicado {
  id: number;
  titulo: string;
  data: string;
  conteudo: string;
  pdfUrl?: string;
}

interface ComunicadosPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data: Comunicado[];
}

export const ComunicadosPanel = ({ isOpen, onClose, data }: ComunicadosPanelProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50"
          >
        <div className="p-6 relative h-full">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            aria-label="Fechar comunicados"
          >
            <X className="h-6 w-6" />
          </button>
          <h2 className="text-2xl font-bold mb-4">Comunicados</h2>
          <div className="h-[calc(100%-50px)] overflow-y-auto pr-2 space-y-4">
            {data.map((comunicado) => (
              <div 
                key={comunicado.id} 
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition bg-gray-50 flex flex-col"
              >
                <h3 className="text-lg font-semibold text-primary mb-1">
                  {comunicado.titulo}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{comunicado.data}</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                  {comunicado.conteudo}
                </p>
                {comunicado.pdfUrl && (
                  <a
                    href={comunicado.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center mt-auto px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition text-sm font-medium"
                  >
                    Consultar PDF
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};