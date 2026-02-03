import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Plus,
    ArrowLeft,
    WifiOff,
    Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { safeStorage } from '@/lib/safeStorage';
import { playersByPosition } from '@/data/siteData';

// --- Types & Components ---
import { Category, Training, TrainingData, AttendanceData, CategoryItem } from '@/lib/treinosFormacaoTypes';
import { Login } from './sections/treinosFormacaoPage/Login';
import { Dashboard } from './sections/treinosFormacaoPage/Dashboard';
import { AttendanceSection } from './sections/treinosFormacaoPage/AttendanceSection';
import { TrainingSection } from './sections/treinosFormacaoPage/TrainingSection';
import { AttendanceModal } from './sections/treinosFormacaoPage/AttendanceModal';
import { TrainingModal } from './sections/treinosFormacaoPage/TrainingModal';

// --- Constants ---
const PASSWORD = "Ornelas";
const CATEGORIES: CategoryItem[] = [
    { id: 'sub11', name: 'Sub11', color: 'bg-yellow-500' },
    { id: 'sub13', name: 'Sub13', color: 'bg-green-600' },
    { id: 'sub15', name: 'Sub15', color: 'bg-blue-500' },
    { id: 'sub17', name: 'Sub17', color: 'bg-purple-600' },
    { id: 'seniores', name: 'Assiduidade Seniores', color: 'bg-slate-800', icon: Users },
];

const ALL_PLAYERS = Object.values(playersByPosition).flat();

export const TreinosFormacao = () => {
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
        const auth = localStorage.getItem('auth_treinos');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }

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
            localStorage.setItem('auth_treinos', 'true');
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
            updatedTrainings = updatedTrainings.map(t =>
                t.id === editingId ? { ...t, date: trainingForm.date, content: trainingForm.content } : t
            );
        } else {
            const newEntry: Training = {
                id: crypto.randomUUID(),
                date: trainingForm.date,
                content: trainingForm.content
            };
            updatedTrainings = [newEntry, ...updatedTrainings];
        }

        updatedTrainings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const updated = { ...trainings, [selectedCategory]: updatedTrainings };
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
        return <Login passwordInput={passwordInput} setPasswordInput={setPasswordInput} handleLogin={handleLogin} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Helmet>
                <title>Gestão de Treinos - HC PDL</title>
            </Helmet>

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
                    <Dashboard
                        categories={CATEGORIES}
                        onSelectCategory={setSelectedCategory}
                        attendance={attendance}
                        trainings={trainings}
                    />
                ) : selectedCategory === 'seniores' ? (
                    <AttendanceSection
                        attendance={attendance}
                        updateValuePerSession={updateValuePerSession}
                        expandedId={expandedId}
                        setExpandedId={setExpandedId}
                        allPlayers={ALL_PLAYERS}
                        formatDate={formatDate}
                        onEditSession={(session) => {
                            setEditingId(session.id);
                            setTrainingForm({ date: session.date, content: session.presentPlayers.join(',') });
                            setIsModalOpen(true);
                        }}
                        onDeleteSession={handleDeleteAttendance}
                    />
                ) : (
                    <TrainingSection
                        trainings={trainings[selectedCategory] || []}
                        expandedId={expandedId}
                        setExpandedId={setExpandedId}
                        formatDate={formatDate}
                        getTrainingSnippet={getTrainingSnippet}
                        handleCopyText={handleCopyText}
                        openEditModal={openEditModal}
                        handleDeleteTraining={handleDeleteTraining}
                    />
                )}
            </main>

            {selectedCategory && (
                <Button
                    onClick={openCreateModal}
                    className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center p-0"
                >
                    <Plus className="w-8 h-8" />
                </Button>
            )}

            {selectedCategory === 'seniores' ? (
                <AttendanceModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    editingId={editingId}
                    trainingForm={trainingForm}
                    setTrainingForm={setTrainingForm}
                    allPlayers={ALL_PLAYERS}
                    handleSaveAttendance={handleSaveAttendance}
                />
            ) : selectedCategory && (
                <TrainingModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    editingId={editingId}
                    categoryName={CATEGORIES.find(c => c.id === selectedCategory)?.name || ''}
                    trainingForm={trainingForm}
                    setTrainingForm={setTrainingForm}
                    handleSaveTraining={handleSaveTraining}
                />
            )}
        </div>
    );
};
