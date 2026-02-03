import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Copy, Edit2, Trash2, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Training } from '@/lib/treinosFormacaoTypes';

interface TrainingSectionProps {
    trainings: Training[];
    expandedId: string | null;
    setExpandedId: (id: string | null) => void;
    formatDate: (date: string) => string;
    getTrainingSnippet: (content: string) => string;
    handleCopyText: (text: string) => void;
    openEditModal: (training: Training) => void;
    handleDeleteTraining: (id: string) => void;
}

export const TrainingSection: React.FC<TrainingSectionProps> = ({
    trainings,
    expandedId,
    setExpandedId,
    formatDate,
    getTrainingSnippet,
    handleCopyText,
    openEditModal,
    handleDeleteTraining
}) => {
    return (
        <div className="space-y-3">
            {trainings.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Nenhum treino registado para este escalão.</p>
                </div>
            ) : (
                trainings.map((training) => (
                    <div key={training.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div
                            onClick={() => setExpandedId(expandedId === training.id ? null : training.id)}
                            className="p-4 flex items-center justify-between cursor-pointer active:bg-gray-50"
                        >
                            <div className="flex flex-col">
                                <span className="text-primary font-bold text-lg">{formatDate(training.date)}</span>
                                <span className="text-gray-500 text-sm italic">{getTrainingSnippet(training.content)}</span>
                            </div>
                            {expandedId === training.id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                        </div>

                        <AnimatePresence>
                            {expandedId === training.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="px-4 pb-4 pt-2 border-t border-gray-50">
                                        <p className="whitespace-pre-wrap text-gray-700 leading-relaxed mb-4">
                                            {training.content}
                                        </p>
                                        <div className="flex gap-2 justify-end flex-wrap">
                                            <Button variant="outline" size="sm" onClick={() => handleCopyText(training.content)} className="flex gap-2">
                                                <Copy className="w-4 h-4" /> Copiar
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => openEditModal(training)} className="flex gap-2">
                                                <Edit2 className="w-4 h-4" /> Editar
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDeleteTraining(training.id)} className="flex gap-2">
                                                <Trash2 className="w-4 h-4" /> Apagar
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))
            )}
        </div>
    );
};
