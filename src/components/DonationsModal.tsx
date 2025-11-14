import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Heart, X, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DonationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationsModal = ({ isOpen, onClose }: DonationsModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("PT50001000004864920000107");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white shadow-t-2xl z-50 p-6 rounded-t-2xl max-w-2xl mx-auto"
          >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X className="h-6 w-6" />
        </button>
        <div className="text-center">
          <Heart className="mx-auto h-12 w-12 text-primary mb-3" />
          <h2 className="text-2xl font-bold mb-2">Apoie o Clube!</h2>
          <p className="text-gray-600 mb-4">
            A sua doação ajuda a financiar os nossos equipamentos, viagens e a formação dos nossos jovens atletas. Qualquer contribuição faz a diferença. Obrigado pelo seu apoio!
          </p>

          <div className="bg-gray-100 p-3 rounded-lg relative inline-block">
            {copied && (
              <span className="absolute -top-6 right-3 text-xs text-green-600 font-medium">
                Copiado!
              </span>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">IBAN</p>
                <p className="text-lg font-mono tracking-wider text-gray-900">PT50 0010 0000 4864 9200 0010 7</p>
              </div>
              <Button variant="ghost" size="icon" className="ml-3 hover:bg-gray-200" onClick={handleCopy} aria-label="Copiar IBAN">
                <Copy className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};