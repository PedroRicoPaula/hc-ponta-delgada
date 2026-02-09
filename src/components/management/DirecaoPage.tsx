import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { MembroDirecao } from '@/lib/managementTypes';
import { initialDirecao } from './managementData';

export const DirecaoPage = () => {
    const [direcao, setDirecao] = useLocalStorage<MembroDirecao[]>('pdl-direcao', initialDirecao);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMembro, setEditingMembro] = useState<MembroDirecao | null>(null);

    const [formData, setFormData] = useState<Partial<MembroDirecao>>({
        nome: '',
        cargo: '',
        telefone: '',
        email: '',
    });

    const filteredDirecao = direcao.filter(membro =>
        membro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        membro.cargo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenDialog = (membro?: MembroDirecao) => {
        if (membro) {
            setEditingMembro(membro);
            setFormData(membro);
        } else {
            setEditingMembro(null);
            setFormData({
                nome: '',
                cargo: '',
                telefone: '',
                email: '',
            });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingMembro(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const now = new Date().toISOString();
        if (editingMembro) {
            setDirecao(direcao.map(m =>
                m.id === editingMembro.id
                    ? { ...formData, id: m.id, createdAt: m.createdAt, updatedAt: now } as MembroDirecao
                    : m
            ));
        } else {
            const newMembro: MembroDirecao = {
                ...formData,
                id: crypto.randomUUID(),
                createdAt: now,
                updatedAt: now,
            } as MembroDirecao;
            setDirecao([...direcao, newMembro]);
        }
        handleCloseDialog();
    };

    const handleDelete = (id: string) => {
        if (confirm('Tem a certeza que deseja eliminar este membro da direção?')) {
            setDirecao(direcao.filter(m => m.id !== id));
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Órgãos Sociais</h2>
                    <p className="text-slate-400 mt-1 font-medium">
                        Corpo Diretivo • {direcao.length} Membro{direcao.length !== 1 ? 's' : ''} em Funções
                    </p>
                </div>
                <button
                    onClick={() => handleOpenDialog()}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                >
                    <Plus className="h-5 w-5" />
                    Novo Membro
                </button>
            </div>

            {/* Search */}
            <Card className="bg-[#1e293b] border-slate-800/50 shadow-xl p-6 rounded-3xl">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-400 transition-colors h-5 w-5" />
                    <Input
                        placeholder="Pesquisar por nome ou cargo diretivo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-900/50 border-slate-800 focus:border-yellow-400/50 focus:ring-yellow-400/20 text-white pl-12 h-12 rounded-xl"
                    />
                </div>
            </Card>

            {/* Members List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDirecao.map(membro => (
                    <Card key={membro.id} className="bg-[#1e293b] border-slate-800/50 hover:border-yellow-400/30 transition-all duration-300 group rounded-[2rem] overflow-hidden relative">
                        <CardHeader className="pb-4 px-8 pt-8 text-center">
                            <div className="mx-auto w-24 h-24 mb-6 relative">
                                <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl group-hover:bg-yellow-400/30 transition-colors" />
                                <div className="relative w-full h-full bg-slate-900 border-2 border-slate-800 rounded-full flex items-center justify-center group-hover:border-yellow-400/50 transition-colors">
                                    <Building2 className="h-10 w-10 text-yellow-400" />
                                </div>
                            </div>
                            <div className="min-w-0">
                                <CardTitle className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                                    {membro.nome}
                                </CardTitle>
                                <div className="mt-3 inline-block px-4 py-1.5 bg-yellow-400 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                                    {membro.cargo}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 space-y-4">
                            <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800/50 space-y-3">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Email Direto</span>
                                    <button className="flex items-center gap-3 w-full p-2 hover:bg-slate-800 rounded-xl transition-all text-left group/btn">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-btn/hover:text-blue-300">@</div>
                                        <span className="text-sm font-bold text-slate-300 truncate">{membro.email || 'Não definido'}</span>
                                    </button>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Contacto Telefónico</span>
                                    <button className="flex items-center gap-3 w-full p-2 hover:bg-slate-800 rounded-xl transition-all text-left">
                                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">#</div>
                                        <span className="text-sm font-bold text-slate-300">{membro.telefone || 'Não definido'}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2 justify-center">
                                <button
                                    onClick={() => handleOpenDialog(membro)}
                                    className="flex-1 py-3 bg-slate-800/50 hover:bg-yellow-400 hover:text-black text-slate-400 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Edit className="h-4 w-4" />
                                    <span>Editar</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(membro.id)}
                                    className="px-4 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all border border-red-500/20"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredDirecao.length === 0 && (
                <div className="text-center py-20 bg-slate-900/50 rounded-[2rem] border border-dashed border-slate-800">
                    <Building2 className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm">Nenhum membro listado</p>
                </div>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    className="w-full sm:w-[95vw] md:max-w-xl bg-[#1e293b] border-slate-800 text-white rounded-none sm:rounded-[2.5rem] shadow-2xl p-0 overflow-hidden h-full sm:h-auto sm:max-h-[90vh]"
                >
                    <DialogHeader className="p-5 sm:p-8 pb-0">
                        <DialogTitle className="text-xl sm:text-2xl font-black text-white">
                            {editingMembro ? 'Editar Registo' : 'Novo Membro Diretivo'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 text-sm">
                            Atualize a composição oficial dos órgãos sociais do clube.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden h-[calc(100vh-100px)] sm:h-auto">
                        <div className="p-5 sm:p-8 pt-4 space-y-6 overflow-y-auto custom-scrollbar flex-1 sm:max-h-[70vh]">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="nome" className="text-slate-500 font-bold ml-1 text-[10px] uppercase tracking-widest">Nome Completo *</Label>
                                    <Input
                                        id="nome"
                                        required
                                        value={formData.nome}
                                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                        className="bg-slate-900 border-slate-800 text-white h-14 rounded-2xl focus:ring-yellow-400/20 focus:border-yellow-400/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cargo" className="text-slate-500 font-bold ml-1 text-[10px] uppercase tracking-widest">Cargo de Direção *</Label>
                                    <Input
                                        id="cargo"
                                        required
                                        placeholder="Ex: Presidente, Diretor Desportivo, Tesoureiro..."
                                        value={formData.cargo}
                                        onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                                        className="bg-slate-900 border-slate-800 text-white h-14 rounded-2xl placeholder:text-slate-700"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="telefone" className="text-slate-500 font-bold ml-1 text-[10px] uppercase tracking-widest">Telemóvel *</Label>
                                        <Input
                                            id="telefone"
                                            type="tel"
                                            required
                                            value={formData.telefone}
                                            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                            className="bg-slate-900 border-slate-800 text-white h-14 rounded-2xl"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-500 font-bold ml-1 text-[10px] uppercase tracking-widest">E-mail *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="bg-slate-900 border-slate-800 text-white h-14 rounded-2xl"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 p-5 sm:p-8 pt-4 sm:pt-6 border-t border-slate-800 bg-[#1e293b] mt-auto">
                            <button
                                type="button"
                                onClick={handleCloseDialog}
                                className="w-full sm:w-auto px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-10 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                            >
                                {editingMembro ? 'Guardar Alterações' : 'Confirmar Nomeação'}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

