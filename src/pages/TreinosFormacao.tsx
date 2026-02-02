import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    ChevronUp,
    Copy,
    Trash2,
    Plus,
    ArrowLeft,
    Calendar,
    Lock,
    Edit2,
    Smartphone,
    WifiOff,
    Users,
    ClipboardList,
    TrendingUp,
    Euro,
    Check
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { safeStorage } from '@/lib/safeStorage';
import { playersByPosition } from '@/data/siteData';

// --- Types ---
type Category = 'sub11' | 'sub13' | 'sub15' | 'sub17' | 'seniores';

interface Training {
    id: string;
    date: string;
    content: string;
}

interface AttendanceSession {
    id: string;
    date: string;
    presentPlayers: string[];
}

interface TrainingData {
    [key: string]: Training[];
}

interface AttendanceData {
    sessions: AttendanceSession[];
    valuePerSession: number;
}

// --- Constants ---
const PASSWORD = "Ornelas";
const CATEGORIES: { id: Category; name: string; color: string; icon?: any }[] = [
    { id: 'sub11', name: 'Sub11', color: 'bg-yellow-500' },
    { id: 'sub13', name: 'Sub13', color: 'bg-green-600' },
    { id: 'sub15', name: 'Sub15', color: 'bg-blue-500' },
    { id: 'sub17', name: 'Sub17', color: 'bg-purple-600' },
    { id: 'seniores', name: 'Assiduidade Seniores', color: 'bg-slate-800', icon: Users },
];

const ALL_PLAYERS = Object.values(playersByPosition).flat();

const TreinosFormacao = () => {
    // --- Auth State ---
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');

    // --- App State ---
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [trainings, setTrainings] = useState<TrainingData>({
        sub11: [],
        sub13: [],
        sub15: [],
        sub17: [],
        seniores: []
    });
    const [attendance, setAttendance] = useState<AttendanceData>({
        sessions: [],
        valuePerSession: 50 // Default value per training
    });
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // --- PWA State ---
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // --- Modal State ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [trainingForm, setTrainingForm] = useState({ date: new Date().toISOString().split('T')[0], content: '' });

    // --- Initialize ---
    useEffect(() => {
        // Check Auth

        // Check Auth
        const auth = sessionStorage.getItem('auth_treinos');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }

        // Load Data
        const savedData = safeStorage.getItem('hc_trainings');
        if (savedData) {
            try {
                setTrainings(JSON.parse(savedData));
            } catch (e) {
                console.error("Failed to parse training data", e);
            }
        }

        const savedAttendance = safeStorage.getItem('hc_attendance');
        if (savedAttendance) {
            try {
                setAttendance(JSON.parse(savedAttendance));
            } catch (e) {
                console.error("Failed to parse attendance data", e);
            }
        }

        // Monitor online status
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // --- Auth Handlers ---
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordInput === PASSWORD) {
            setIsAuthenticated(true);
            sessionStorage.setItem('auth_treinos', 'true');
            toast.success("Acesso concedido");
        } else {
            toast.error("Password incorreta");
        }
    };

    // --- Data Handlers ---
    const saveToStorage = (data: TrainingData) => {
        safeStorage.setItem('hc_trainings', JSON.stringify(data));
        setTrainings(data);
    };

    const handleSaveTraining = () => {
        if (!selectedCategory || !trainingForm.content) return;

        let updatedTrainings = [...(trainings[selectedCategory] || [])];

        if (editingId) {
            // Edit existing
            updatedTrainings = updatedTrainings.map(t =>
                t.id === editingId ? { ...t, date: trainingForm.date, content: trainingForm.content } : t
            );
        } else {
            // Create new
            const newEntry: Training = {
                id: crypto.randomUUID(),
                date: trainingForm.date,
                content: trainingForm.content
            };
            updatedTrainings = [newEntry, ...updatedTrainings];
        }

        // Sort by date
        updatedTrainings.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        const updated = {
            ...trainings,
            [selectedCategory]: updatedTrainings
        };

        saveToStorage(updated);
        closeModal();
        toast.success(editingId ? "Treino atualizado" : "Treino guardado");
    };

    const openCreateModal = () => {
        setEditingId(null);
        setTrainingForm({ date: new Date().toISOString().split('T')[0], content: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (training: Training) => {
        setEditingId(training.id);
        setTrainingForm({ date: training.date, content: training.content });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setTrainingForm({ date: new Date().toISOString().split('T')[0], content: '' });
    };

    // --- Attendance Handlers ---
    const handleSaveAttendance = (date: string, presentPlayers: string[]) => {
        let updatedSessions = [...attendance.sessions];
        if (editingId) {
            updatedSessions = updatedSessions.map(s =>
                s.id === editingId ? { ...s, date, presentPlayers } : s
            );
        } else {
            updatedSessions.push({
                id: crypto.randomUUID(),
                date,
                presentPlayers
            });
        }

        updatedSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const updated = { ...attendance, sessions: updatedSessions };
        safeStorage.setItem('hc_attendance', JSON.stringify(updated));
        setAttendance(updated);
        closeModal();
        toast.success("Assiduidade guardada");
    };

    const handleDeleteAttendance = (id: string) => {
        if (!window.confirm("Apagar registo de assiduidade?")) return;
        const updated = {
            ...attendance,
            sessions: attendance.sessions.filter(s => s.id !== id)
        };
        safeStorage.setItem('hc_attendance', JSON.stringify(updated));
        setAttendance(updated);
        toast.info("Registo removido");
    };

    const updateValuePerSession = (val: number) => {
        const updated = { ...attendance, valuePerSession: val };
        safeStorage.setItem('hc_attendance', JSON.stringify(updated));
        setAttendance(updated);
    };

    const handleDeleteTraining = (id: string) => {
        if (!selectedCategory) return;
        if (!window.confirm("Tem a certeza que deseja apagar este treino?")) return;

        const updated = {
            ...trainings,
            [selectedCategory]: trainings[selectedCategory].filter(t => t.id !== id)
        };

        saveToStorage(updated);
        toast.info("Treino removido");
    };

    const handleCopyText = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Texto copiado para a área de transferência");
    };

    // --- Render Helpers ---
    const getTrainingSnippet = (content: string) => {
        const words = content.split(' ');
        if (words.length <= 8) return content;
        return words.slice(0, 8).join(' ') + '...';
    };

    const formatDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const weekday = new Intl.DateTimeFormat('pt-PT', { weekday: 'long' }).format(date);
        return `${date.toLocaleDateString('pt-PT')} (${weekday.charAt(0).toUpperCase() + weekday.slice(1)})`;
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Helmet>
                    <title>Acesso Restrito - Treinos Formação</title>
                </Helmet>
                <Card className="w-full max-w-md shadow-xl border-t-4 border-primary">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <Lock className="text-primary w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl">Área de Gestão</CardTitle>
                        <CardDescription>Introduza a password para aceder aos treinos de formação</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className="text-center text-lg tracking-widest"
                                autoFocus
                            />
                            <Button type="submit" className="w-full h-12 text-lg">Entrar</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Helmet>
                <title>Gestão de Treinos - HC PDL</title>
            </Helmet>

            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10 px-4 py-4 flex items-center gap-4">
                {selectedCategory && (
                    <Button variant="ghost" size="icon" onClick={() => setSelectedCategory(null)}>
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                )}
                <h1 className="text-xl font-bold text-gray-800">
                    {selectedCategory ? `Treinos ${CATEGORIES.find(c => c.id === selectedCategory)?.name}` : 'Gestão de Treinos'}
                </h1>
                {!isOnline && (
                    <div className="ml-auto flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                        <WifiOff className="w-3 h-3" /> Offline
                    </div>
                )}
            </header>

            <main className="p-4 max-w-2xl mx-auto">
                {!selectedCategory ? (
                    /* Dashboard Categories */
                    <div className="grid grid-cols-2 gap-4">
                        {CATEGORIES.map((cat) => (
                            <motion.div
                                key={cat.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`${cat.color} ${cat.id === 'seniores' ? 'col-span-2 h-32' : 'h-40'} rounded-2xl shadow-lg flex flex-col items-center justify-center text-white cursor-pointer transition-all hover:opacity-90`}
                            >
                                {cat.icon && <cat.icon className="w-8 h-8 mb-2 opacity-80" />}
                                <span className={`${cat.id === 'seniores' ? 'text-xl' : 'text-3xl'} font-black text-center px-4`}>{cat.name}</span>
                                <span className="text-sm opacity-80 mt-1 font-medium">
                                    {cat.id === 'seniores' ? `${attendance.sessions.length} sessões registadas` : `${trainings[cat.id]?.length || 0} treinos`}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                ) : selectedCategory === 'seniores' ? (
                    /* Attendance View */
                    <div className="space-y-6">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 gap-3">
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <TrendingUp className="w-5 h-5 mx-auto mb-2 text-primary" />
                                    <div className="text-2xl font-bold">{attendance.sessions.length}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Treinos Totais</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <Euro className="w-5 h-5 mx-auto mb-2 text-green-600" />
                                    <div className="flex items-center justify-center gap-1">
                                        <input
                                            type="number"
                                            value={attendance.valuePerSession}
                                            onChange={(e) => updateValuePerSession(Number(e.target.value))}
                                            className="w-12 bg-transparent text-center border-b border-dashed border-gray-300 focus:outline-none focus:border-primary font-bold text-2xl"
                                        />
                                        <span className="font-bold text-2xl">€</span>
                                    </div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Valor/Treino</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Tabs: Log vs Stats */}
                        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                            <button
                                onClick={() => setExpandedId('log')}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${expandedId !== 'stats' ? 'bg-primary text-white shadow-sm' : 'text-gray-500'}`}
                            >
                                Registos
                            </button>
                            <button
                                onClick={() => setExpandedId('stats')}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${expandedId === 'stats' ? 'bg-primary text-white shadow-sm' : 'text-gray-500'}`}
                            >
                                Estatísticas
                            </button>
                        </div>

                        {expandedId === 'stats' ? (
                            /* Stats Table */
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase">Jogador</th>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase text-center">Pres.</th>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase text-center">%</th>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {ALL_PLAYERS.map(player => {
                                            const presences = attendance.sessions.filter(s => s.presentPlayers.includes(player)).length;
                                            const percentage = attendance.sessions.length > 0 ? Math.round((presences / attendance.sessions.length) * 100) : 0;
                                            const totalValue = presences * attendance.valuePerSession;
                                            return (
                                                <tr key={player} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-700">{player}</td>
                                                    <td className="px-4 py-3 text-sm text-center font-mono">{presences}</td>
                                                    <td className="px-4 py-3 text-sm text-center">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${percentage > 80 ? 'bg-green-100 text-green-700' : percentage > 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                            {percentage}%
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-bold text-right text-green-600">{totalValue}€</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            /* Sessions Log */
                            <div className="space-y-3">
                                {attendance.sessions.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                        <p>Sem registos. Clica no + para começar.</p>
                                    </div>
                                ) : (
                                    attendance.sessions.map(session => (
                                        <div key={session.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                                            <div>
                                                <div className="font-bold text-gray-800">{formatDate(session.date)}</div>
                                                <div className="text-xs text-gray-500">{session.presentPlayers.length} presentes / {ALL_PLAYERS.length} total</div>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => {
                                                    setEditingId(session.id);
                                                    setTrainingForm({
                                                        date: session.date,
                                                        content: session.presentPlayers.join(',')
                                                    });
                                                    setIsModalOpen(true);
                                                }} className="h-8 w-8">
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteAttendance(session.id)} className="h-8 w-8 text-red-500">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Training List (Accordion) */
                    <div className="space-y-3">
                        {trainings[selectedCategory]?.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>Nenhum treino registado para este escalão.</p>
                            </div>
                        ) : (
                            trainings[selectedCategory].map((training) => (
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
                )}
            </main>

            {/* Floating Action Button */}
            {selectedCategory && (
                <Button
                    onClick={openCreateModal}
                    className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center p-0"
                >
                    <Plus className="w-8 h-8" />
                </Button>
            )}

            {/* Attendance Modal */}
            {selectedCategory === 'seniores' && (
                <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
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
                                            const allSelected = current.length === ALL_PLAYERS.length;
                                            setTrainingForm({ ...trainingForm, content: allSelected ? '' : ALL_PLAYERS.join(',') });
                                        }}
                                    >
                                        {trainingForm.content.split(',').filter(x => x).length === ALL_PLAYERS.length ? 'Desmarcar Todos' : 'Marcar Todos'}
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 gap-1">
                                    {ALL_PLAYERS.map(player => {
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
                            <Button variant="outline" onClick={closeModal} className="flex-1">Cancelar</Button>
                            <Button
                                onClick={() => handleSaveAttendance(trainingForm.date, trainingForm.content.split(',').filter(p => p))}
                                className="flex-1"
                            >
                                Salvar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Modal for Create/Edit Trainings */}
            {selectedCategory && selectedCategory !== 'seniores' && (
                <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Editar Treino' : 'Novo Treino'} {CATEGORIES.find(c => c.id === selectedCategory)?.name}</DialogTitle>
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
                            <Button variant="outline" onClick={closeModal}>Cancelar</Button>
                            <Button onClick={handleSaveTraining}>{editingId ? 'Atualizar' : 'Salvar'}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default TreinosFormacao;
