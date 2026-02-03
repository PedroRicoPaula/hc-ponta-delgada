import React from 'react';
import { Check } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AttendanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingId: string | null;
    trainingForm: { date: string; content: string };
    setTrainingForm: (form: { date: string; content: string }) => void;
    allPlayers: string[];
    handleSaveAttendance: (date: string, presentPlayers: string[]) => void;
}

export const AttendanceModal: React.FC<AttendanceModalProps> = ({
    isOpen,
    onClose,
    editingId,
    trainingForm,
    setTrainingForm,
    allPlayers,
    handleSaveAttendance
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>{editingId ? 'Editar Assiduidade' : 'Nova Assiduidade'}</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 space-y-4 py-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Data do Treino</label>
                        <Input
                            type="date"
                            value={trainingForm.date}
                            onChange={(e) => setTrainingForm({ ...trainingForm, date: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2 pb-4">
                        <div className="flex items-center justify-between sticky top-0 bg-white py-2 z-10 border-b">
                            <label className="text-sm font-bold">Jogadores Presentes</label>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary text-[10px] uppercase font-bold"
                                onClick={() => {
                                    const current = trainingForm.content.split(',').filter(x => x);
                                    const allSelected = current.length === allPlayers.length;
                                    setTrainingForm({ ...trainingForm, content: allSelected ? '' : allPlayers.join(',') });
                                }}
                            >
                                {trainingForm.content.split(',').filter(x => x).length === allPlayers.length ? 'Desmarcar Todos' : 'Marcar Todos'}
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-1">
                            {allPlayers.map(player => {
                                const isPresent = trainingForm.content.split(',').includes(player);
                                return (
                                    <div
                                        key={player}
                                        onClick={() => {
                                            let players = trainingForm.content.split(',').filter(p => p);
                                            if (players.includes(player)) {
                                                players = players.filter(p => p !== player);
                                            } else {
                                                players.push(player);
                                            }
                                            setTrainingForm({ ...trainingForm, content: players.join(',') });
                                        }}
                                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${isPresent ? 'bg-primary/5 border-primary shadow-sm' : 'border-gray-100 hover:border-gray-300'}`}
                                    >
                                        <span className={`text-sm ${isPresent ? 'font-bold text-gray-900' : 'text-gray-600'}`}>{player}</span>
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${isPresent ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                                            {isPresent && <Check className="w-3 h-3 text-white stroke-[4]" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 pt-2 border-t mt-auto">
                    <Button variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
                    <Button
                        onClick={() => handleSaveAttendance(trainingForm.date, trainingForm.content.split(',').filter(p => p))}
                        className="flex-1"
                    >
                        Salvar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
