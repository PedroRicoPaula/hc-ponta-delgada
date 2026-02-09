import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Bus, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Viagem, ModoTransporte, Atleta, MembroDirecao } from '@/lib/managementTypes';
import { cn } from '@/lib/utils';
import { initialAtletas, initialDirecao } from './managementData';

export const ViagensPage = () => {
    const [viagens, setViagens] = useLocalStorage<Viagem[]>('pdl-viagens', []);
    const [atletas] = useLocalStorage<Atleta[]>('pdl-atletas', initialAtletas);
    const [direcao] = useLocalStorage<MembroDirecao[]>('pdl-direcao', initialDirecao);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingViagem, setEditingViagem] = useState<Viagem | null>(null);

    const [formData, setFormData] = useState<Partial<Viagem>>({
        adversario: '',
        pavilhaoUrl: '',
        dataIda: '',
        dataVolta: '',
        horaPartida: '',
        modoTransporte: 'carrinha-clube',
        condutores: [],
        refeicaoLocal: '',
        refeicaoLink: '',
        refeicaoHora: '',
        notas: '',
    });

    const filteredViagens = viagens.filter(v =>
        v.adversario.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const potentialDrivers = [
        ...atletas.filter(a => a.escalao === 'seniores').map(a => ({ id: a.id, nome: a.nome, tipo: 'Atleta' })),
        ...direcao.map(d => ({ id: d.id, nome: d.nome, tipo: 'Direção' })),
    ];

    const handleOpenDialog = (viagem?: Viagem) => {
        if (viagem) {
            setEditingViagem(viagem);
            setFormData(viagem);
        } else {
            setEditingViagem(null);
            setFormData({
                adversario: '',
                pavilhaoUrl: '',
                dataIda: '',
                dataVolta: '',
                horaPartida: '',
                modoTransporte: 'carrinha-clube',
                condutores: [],
                refeicaoLocal: '',
                refeicaoLink: '',
                refeicaoHora: '',
                notas: '',
            });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingViagem(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const now = new Date().toISOString();
        if (editingViagem) {
            setViagens(viagens.map(v =>
                v.id === editingViagem.id
                    ? { ...formData, id: v.id, createdAt: v.createdAt, updatedAt: now } as Viagem
                    : v
            ));
        } else {
            const newViagem: Viagem = {
                ...formData,
                id: crypto.randomUUID(),
                createdAt: now,
                updatedAt: now,
            } as Viagem;
            setViagens([...viagens, newViagem]);
        }
        handleCloseDialog();
    };

    const handleDelete = (id: string) => {
        if (confirm('Tem a certeza que deseja eliminar esta viagem?')) {
            setViagens(viagens.filter(v => v.id !== id));
        }
    };

    const toggleCondutor = (condutorId: string) => {
        const current = formData.condutores || [];
        if (current.includes(condutorId)) {
            setFormData({ ...formData, condutores: current.filter(id => id !== condutorId) });
        } else {
            setFormData({ ...formData, condutores: [...current, condutorId] });
        }
    };

    const isFutureTrip = (dataIda: string) => {
        const tripDate = new Date(dataIda);
        tripDate.setHours(23, 59, 59, 999);
        return tripDate >= new Date();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tight">Logística de Viagens</h2>
                    <p className="text-slate-400 mt-1 font-medium">
                        {viagens.length} itinerário{viagens.length !== 1 ? 's' : ''} planeado{viagens.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={() => handleOpenDialog()}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                >
                    <Plus className="h-5 w-5" />
                    Planear Viagem
                </button>
            </div>

            {/* Search */}
            <Card className="bg-[#1e293b] border-slate-800/50 shadow-xl p-6 rounded-3xl">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-400 transition-colors h-5 w-5" />
                    <Input
                        placeholder="Pesquisar por destino ou adversário..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-900/50 border-slate-800 focus:border-yellow-400/50 focus:ring-yellow-400/20 text-white pl-12 h-12 rounded-xl"
                    />
                </div>
            </Card>

            {/* Trips List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredViagens.sort((a, b) => new Date(a.dataIda).getTime() - new Date(b.dataIda).getTime()).map(viagem => {
                    const isFuture = isFutureTrip(viagem.dataIda);

                    return (
                        <Card key={viagem.id} className={cn(
                            "bg-[#1e293b] border-slate-800/50 hover:border-yellow-400/30 transition-all duration-300 group rounded-3xl overflow-hidden relative",
                            isFuture ? "ring-2 ring-yellow-400/20" : "opacity-75 grayscale-[0.5] hover:grayscale-0"
                        )}>
                            <CardHeader className="pb-3 px-6 pt-6">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                                            isFuture ? "bg-yellow-400 text-black" : "bg-slate-800 text-slate-500"
                                        )}>
                                            <Bus className="h-7 w-7" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-xl font-bold text-white truncate">
                                                    {viagem.adversario}
                                                </CardTitle>
                                                {isFuture && (
                                                    <span className="px-2 py-0.5 bg-yellow-400/10 text-yellow-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-yellow-400/20">
                                                        Próxima
                                                    </span>
                                                )}
                                            </div>
                                            {viagem.pavilhaoUrl && (
                                                <a
                                                    href={viagem.pavilhaoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-yellow-400 hover:text-yellow-300 transition-colors mt-1"
                                                >
                                                    <MapPin className="h-3 w-3" />
                                                    Ver Pavilhão
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenDialog(viagem)}
                                            className="p-2 bg-slate-800/50 hover:bg-yellow-400/20 text-slate-400 hover:text-yellow-400 rounded-xl transition-all"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(viagem.id)}
                                            className="p-2 bg-slate-800/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="px-6 pb-6 mt-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800/50 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-4 w-4 text-yellow-400" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Datas</span>
                                                <span className="text-sm font-bold text-slate-200">
                                                    {new Date(viagem.dataIda).toLocaleDateString('pt-PT')}
                                                    {viagem.dataIda !== viagem.dataVolta && ` - ${new Date(viagem.dataVolta).toLocaleDateString('pt-PT')}`}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Bus className="h-4 w-4 text-yellow-400" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Transporte</span>
                                                <span className="text-sm font-bold text-slate-200 capitalize">{viagem.modoTransporte.replace('-', ' ')}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Bus className="h-4 w-4 text-emerald-400" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Estado Logística</span>
                                                <span className="text-sm font-bold text-emerald-400">Confirmada</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800/50 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Bus className="h-4 w-4 text-yellow-400" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Hora de Partida</span>
                                                <span className="text-sm font-bold text-slate-200 text-yellow-500">{viagem.horaPartida}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Users className="h-4 w-4 text-yellow-400" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Condutores</span>
                                                <span className="text-sm font-bold text-slate-200">{viagem.condutores.length} Atribuídos</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {viagem.refeicaoLocal && (
                                    <div className="mt-4 p-4 bg-yellow-400/5 rounded-2xl border border-yellow-400/10">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center text-yellow-400 font-bold text-sm">R</div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Refeição</span>
                                                    {viagem.refeicaoLink ? (
                                                        <a
                                                            href={viagem.refeicaoLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm font-bold text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1"
                                                        >
                                                            {viagem.refeicaoLocal}
                                                            <Search className="w-3 h-3" />
                                                        </a>
                                                    ) : (
                                                        <span className="text-sm font-bold text-slate-200">{viagem.refeicaoLocal}</span>
                                                    )}
                                                </div>
                                            </div>
                                            {viagem.refeicaoHora && (
                                                <span className="text-xs font-black bg-yellow-400 text-black px-2 py-1 rounded-lg">
                                                    {viagem.refeicaoHora}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {filteredViagens.length === 0 && (
                <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
                    <Bus className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium font-bold uppercase tracking-widest">Nenhuma viagem registada</p>
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl bg-[#1e293b] border-slate-800 text-white rounded-[2rem] shadow-2xl p-0 overflow-hidden">
                    <DialogHeader className="p-8 pb-0">
                        <DialogTitle className="text-2xl font-black text-white">
                            {editingViagem ? 'Editar Viagem' : 'Planear Viagem'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Logística e planeamento de deslocação.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Básicos */}
                            <div className="space-y-4 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="adversario" className="text-slate-500 font-bold ml-1 text-[10px] uppercase tracking-widest">Adversário *</Label>
                                    <Input
                                        id="adversario"
                                        required
                                        value={formData.adversario}
                                        onChange={(e) => setFormData({ ...formData, adversario: e.target.value })}
                                        className="bg-slate-900 border-slate-800 text-white h-12 rounded-xl"
                                        placeholder="Clube Adversário"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pavilhaoUrl" className="text-slate-500 font-bold ml-1 text-[10px] uppercase tracking-widest">URL do Pavilhão (Google Maps)</Label>
                                    <Input
                                        id="pavilhaoUrl"
                                        value={formData.pavilhaoUrl || ''}
                                        onChange={(e) => setFormData({ ...formData, pavilhaoUrl: e.target.value })}
                                        className="bg-slate-900 border-slate-800 text-white h-12 rounded-xl"
                                        placeholder="https://maps.google.com/..."
                                    />
                                </div>
                            </div>

                            {/* Transporte e Horários */}
                            <div className="space-y-4 md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="modoTransporte" className="text-slate-500 font-bold ml-1 text-[10px] uppercase tracking-widest">Transporte *</Label>
                                    <Select
                                        value={formData.modoTransporte}
                                        onValueChange={(value: ModoTransporte) => setFormData({
                                            ...formData,
                                            modoTransporte: value,
                                            condutores: value === 'carros-alugados' ? formData.condutores : []
                                        })}
                                    >
                                        <SelectTrigger className="bg-slate-900 border-slate-800 text-white h-12 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                                            <SelectItem value="carrinha-clube">Carrinha do Clube</SelectItem>
                                            <SelectItem value="carros-alugados">Carros Alugados</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="horaPartida" className="text-slate-500 font-bold ml-1 text-[10px] uppercase tracking-widest">Hora Partida *</Label>
                                    <Input
                                        id="horaPartida"
                                        type="time"
                                        required
                                        value={formData.horaPartida}
                                        onChange={(e) => setFormData({ ...formData, horaPartida: e.target.value })}
                                        className="bg-slate-900 border-slate-800 text-white h-12 rounded-xl [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            {/* Calendário */}
                            <div className="space-y-4 md:col-span-2 grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dataIda" className="text-slate-500 font-bold ml-1 text-[10px] uppercase tracking-widest">Data Ida *</Label>
                                    <Input
                                        id="dataIda"
                                        type="date"
                                        required
                                        value={formData.dataIda}
                                        onChange={(e) => setFormData({ ...formData, dataIda: e.target.value })}
                                        className="bg-slate-900 border-slate-800 text-white h-12 rounded-xl [color-scheme:dark]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dataVolta" className="text-slate-500 font-bold ml-1 text-[10px] uppercase tracking-widest">Data Volta *</Label>
                                    <Input
                                        id="dataVolta"
                                        type="date"
                                        required
                                        value={formData.dataVolta}
                                        onChange={(e) => setFormData({ ...formData, dataVolta: e.target.value })}
                                        className="bg-slate-900 border-slate-800 text-white h-12 rounded-xl [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            {/* Seleção de Staff/Condutores - Apenas para carros alugados */}
                            {formData.modoTransporte === 'carros-alugados' && (
                                <div className="space-y-4 md:col-span-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-slate-300 font-bold ml-1 text-[11px] uppercase tracking-[0.2em]">Condutores Disponíveis</Label>
                                        <span className="text-[10px] font-black text-yellow-400 px-2 py-0.5 bg-yellow-400/10 rounded-lg">Seniores + Direção</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900/50 p-4 rounded-3xl border border-slate-800/50 max-h-[300px] overflow-y-auto custom-scrollbar">
                                        {potentialDrivers.length === 0 ? (
                                            <p className="col-span-2 text-center text-slate-600 py-4 italic text-sm">Nenhum condutor disponível</p>
                                        ) : (
                                            potentialDrivers.map(driver => (
                                                <div key={driver.id}
                                                    onClick={() => toggleCondutor(driver.id)}
                                                    className={cn(
                                                        "flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer border group",
                                                        formData.condutores?.includes(driver.id) ? "bg-yellow-400/10 border-yellow-400/30" : "bg-slate-900 border-slate-800/50 hover:border-slate-700"
                                                    )}>
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black",
                                                            formData.condutores?.includes(driver.id) ? "bg-yellow-400 text-black" : "bg-slate-800 text-slate-500"
                                                        )}>
                                                            {driver.nome.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold text-slate-200">{driver.nome}</span>
                                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{driver.tipo}</span>
                                                        </div>
                                                    </div>
                                                    <Checkbox checked={formData.condutores?.includes(driver.id)} className="border-slate-700 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400" />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Refeição */}
                            <div className="md:col-span-2 bg-yellow-400/5 p-6 rounded-[2.5rem] border border-yellow-400/10 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center text-yellow-500">
                                        <Bus className="h-5 w-5" />
                                    </div>
                                    <h4 className="font-black text-white text-sm uppercase tracking-widest">Planeamento de Alimentação</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="refeicaoLocal" className="text-slate-500 font-bold ml-1 text-[10px] uppercase tracking-widest">Local</Label>
                                        <Input
                                            id="refeicaoLocal"
                                            value={formData.refeicaoLocal}
                                            onChange={(e) => setFormData({ ...formData, refeicaoLocal: e.target.value })}
                                            className="bg-slate-900 border-slate-800 text-white h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="refeicaoHora" className="text-slate-500 font-bold ml-1 text-[10px] uppercase tracking-widest">Hora</Label>
                                        <Input
                                            id="refeicaoHora"
                                            type="time"
                                            value={formData.refeicaoHora}
                                            onChange={(e) => setFormData({ ...formData, refeicaoHora: e.target.value })}
                                            className="bg-slate-900 border-slate-800 text-white h-12 rounded-xl [color-scheme:dark]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="refeicaoLink" className="text-slate-500 font-bold ml-1 text-[10px] uppercase tracking-widest">Link Maps</Label>
                                        <Input
                                            id="refeicaoLink"
                                            value={formData.refeicaoLink}
                                            onChange={(e) => setFormData({ ...formData, refeicaoLink: e.target.value })}
                                            className="bg-slate-900 border-slate-800 text-white h-12 rounded-xl"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Notas */}
                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="notas" className="text-slate-500 font-bold ml-1 text-[10px] uppercase tracking-widest">Notas Adicionais</Label>
                                <Textarea
                                    id="notas"
                                    value={formData.notas}
                                    onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                                    className="bg-slate-900 border-slate-800 text-white rounded-2xl min-h-[100px]"
                                    placeholder="Outros detalhes relevantes..."
                                />
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-slate-800">
                            <button
                                type="button"
                                onClick={handleCloseDialog}
                                className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
                            >
                                Descartar
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                            >
                                {editingViagem ? 'Guardar Alterações' : 'Concluir Itinerário'}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

