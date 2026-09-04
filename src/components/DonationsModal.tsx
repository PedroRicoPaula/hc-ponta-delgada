import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Heart, X, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CLUB_IBAN, ibanCompact } from '@/data/merchData';

interface DonationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationsModal = ({ isOpen, onClose }: DonationsModalProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(ibanCompact(CLUB_IBAN));
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
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-t-2xl z-50 p-6 rounded-t-2xl max-w-2xl mx-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Apoie o Clube"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="text-center">
              <Heart className="mx-auto h-12 w-12 text-primary mb-3" />
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Apoie o Clube!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                A sua doação ajuda a financiar os nossos equipamentos, viagens e a formação dos nossos jovens atletas. Qualquer contribuição faz a diferença. Obrigado pelo seu apoio!
              </p>

              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg relative inline-block">
                {copied && (
                  <span className="absolute -top-6 right-3 text-xs text-green-600 dark:text-green-400 font-medium">
                    Copiado!
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">IBAN</p>
                    <p className="text-lg font-mono tracking-wider text-gray-900 dark:text-white">{CLUB_IBAN}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-3 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                    onClick={handleCopy}
                    aria-label="Copiar IBAN"
                  >
                    <Copy className="h-5 w-5" />
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
