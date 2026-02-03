import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TrainingModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingId: string | null;
    categoryName: string;
    trainingForm: { date: string; content: string };
    setTrainingForm: (form: { date: string; content: string }) => void;
    handleSaveTraining: () => void;
}

export const TrainingModal: React.FC<TrainingModalProps> = ({
    isOpen,
    onClose,
    editingId,
    categoryName,
    trainingForm,
    setTrainingForm,
    handleSaveTraining
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{editingId ? 'Editar Treino' : 'Novo Treino'} {categoryName}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Data</label>
                        <Input
                            type="date"
                            value={trainingForm.date}
                            onChange={(e) => setTrainingForm({ ...trainingForm, date: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Conteúdo do Treino</label>
                        <Textarea
                            id="training-content"
                            placeholder="Descreve o plano de treino aqui..."
                            className="min-h-[250px]"
                            value={trainingForm.content}
                            onChange={(e) => setTrainingForm({ ...trainingForm, content: e.target.value })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSaveTraining}>{editingId ? 'Atualizar' : 'Salvar'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
