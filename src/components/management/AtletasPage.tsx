import { useState } from 'react';
import { Plus, Search, Edit, Trash2, X, Users } from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Atleta, Escalao } from '@/lib/managementTypes';
import { initialAtletas } from './managementData';

const escaloes: { value: Escalao; label: string }[] = [
    { value: 'sub11', label: 'Sub 11' },
    { value: 'sub13', label: 'Sub 13' },
    { value: 'sub15', label: 'Sub 15' },
    { value: 'sub17', label: 'Sub 17' },
    { value: 'sub19', label: 'Sub 19' },
    { value: 'seniores', label: 'Seniores' },
];

export const AtletasPage = () => {
    const [atletas, setAtletas] = useLocalStorage<Atleta[]>('pdl-atletas', initialAtletas);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEscalao, setFilterEscalao] = useState<string>('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAtleta, setEditingAtleta] = useState<Atleta | null>(null);

    const [formData, setFormData] = useState<Partial<Atleta>>({
        nome: '',
        escalao: 'sub11',
        dataNascimento: '',
        telefone: '',
        email: '',
        morada: '',
        escola: '',
        cartaoCidadao: '',
        nomePai: '',
        telefonePai: '',
        nomeMae: '',
        telefoneMae: '',
    });

    const filteredAtletas = atletas.filter(atleta => {
        const matchesSearch =
            atleta.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (atleta.numero && atleta.numero.includes(searchTerm));
        const matchesEscalao = filterEscalao === 'all' || atleta.escalao === filterEscalao;
        return matchesSearch && matchesEscalao;
    });

    const handleOpenDialog = (atleta?: Atleta) => {
        if (atleta) {
            setEditingAtleta(atleta);
            setFormData(atleta);
        } else {
            setEditingAtleta(null);
            setFormData({
                nome: '',
                escalao: 'sub11',
                dataNascimento: '',
                telefone: '',
                email: '',
                morada: '',
                escola: '',
                cartaoCidadao: '',
                nomePai: '',
                telefonePai: '',
                nomeMae: '',
                telefoneMae: '',
            });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingAtleta(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const now = new Date().toISOString();
        if (editingAtleta) {
            setAtletas(atletas.map(a =>
                a.id === editingAtleta.id
                    ? { ...formData, id: a.id, createdAt: a.createdAt, updatedAt: now } as Atleta
                    : a
            ));
        } else {
            const newAtleta: Atleta = {
                ...formData,
                id: crypto.randomUUID(),
                createdAt: now,
                updatedAt: now,
            } as Atleta;
            setAtletas([...atletas, newAtleta]);
        }
        handleCloseDialog();
    };

    const handleDelete = (id: string) => {
        if (confirm('Tem a certeza que deseja eliminar este atleta?')) {
            setAtletas(atletas.filter(a => a.id !== id));
        }
    };

    const isFormacao = formData.escalao !== 'seniores';

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tight">Atletas</h2>
                    <p className="text-slate-400 mt-1 font-medium">
                        {atletas.length} atleta{atletas.length !== 1 ? 's' : ''} no sistema
                    </p>
                </div>
                <button
                    onClick={() => handleOpenDialog()}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                >
                    <Plus className="h-5 w-5" />
                    Novo Atleta
                </button>
            </div>

            {/* Filters */}
            <Card className="bg-[#1e293b] border-slate-800/50 shadow-xl p-6 rounded-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-400 transition-colors h-5 w-5" />
                        <Input
                            placeholder="Pesquisar por nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-900/50 border-slate-800 focus:border-yellow-400/50 focus:ring-yellow-400/20 text-white pl-12 h-12 rounded-xl transition-all"
                        />
                    </div>
                    <Select value={filterEscalao} onValueChange={setFilterEscalao}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-800 h-12 rounded-xl text-slate-300 focus:ring-yellow-400/20">
                            <SelectValue placeholder="Filtrar por escalão" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                            <SelectItem value="all">Todos os Escalões</SelectItem>
                            {escaloes.map(e => (
                                <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            {/* Athletes List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAtletas.map(atleta => (
                    <Card key={atleta.id} className="bg-[#1e293b] border-slate-800/50 hover:border-yellow-400/30 transition-all duration-300 group overflow-hidden rounded-3xl">
                        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                        <CardHeader className="pb-3 px-6 pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <CardTitle className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">{atleta.nome}</CardTitle>
                                        {atleta.numero && (
                                            <span className="text-sm font-black text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-lg border border-yellow-500/20">
                                                #{atleta.numero}
                                            </span>
                                        )}
                                    </div>
                                    <div className="inline-block mt-2 px-3 py-1 bg-slate-800 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                                        {atleta.escalao.replace('sub', 'Sub ')}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenDialog(atleta)}
                                        className="p-2 bg-slate-800/50 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-xl transition-all"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(atleta.id)}
                                        className="p-2 bg-slate-800/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 pb-6 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-yellow-400 transition-colors">
                                    <Search className="w-4 h-4" />
                                </div>
                                <span>{atleta.email || 'Sem email'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-yellow-400 transition-colors">
                                    <Plus className="w-4 h-4" />
                                </div>
                                <span>{atleta.telefone || 'Sem telefone'}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredAtletas.length === 0 && (
                <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
                    <Users className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Nenhum atleta encontrado</p>
                </div>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    className="w-[95vw] sm:max-w-2xl bg-[#1e293b] border-slate-800 text-white rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]"
                >
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-white">
                            {editingAtleta ? 'Editar Atleta' : 'Novo Atleta'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Preencha os dados do atleta para o sistema
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <Label htmlFor="nome" className="text-slate-400 font-bold mb-2 block">Nome Completo *</Label>
                                <Input
                                    id="nome"
                                    required
                                    value={formData.nome}
                                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                    className="bg-slate-900/50 border-slate-800 focus:border-yellow-400/50 focus:ring-yellow-400/20 text-white rounded-xl h-12"
                                />
                            </div>

                            <div>
                                <Label htmlFor="escalao" className="text-slate-400 font-bold mb-2 block">Escalão *</Label>
                                <Select
                                    value={formData.escalao}
                                    onValueChange={(value: Escalao) => setFormData({ ...formData, escalao: value })}
                                >
                                    <SelectTrigger className="bg-slate-900/50 border-slate-800 text-white rounded-xl h-12">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                                        {escaloes.map(e => (
                                            <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="numero" className="text-slate-400 font-bold mb-2 block">Número (Opcional)</Label>
                                <Input
                                    id="numero"
                                    placeholder="Ex: 7"
                                    value={formData.numero || ''}
                                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                                    className="bg-slate-900/50 border-slate-800 focus:border-yellow-400/50 focus:ring-yellow-400/20 text-white rounded-xl h-12"
                                />
                            </div>

                            <div>
                                <Label htmlFor="dataNascimento" className="text-slate-400 font-bold mb-2 block">Data de Nascimento *</Label>
                                <Input
                                    id="dataNascimento"
                                    type="date"
                                    required
                                    value={formData.dataNascimento}
                                    onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                                    className="bg-slate-900/50 border-slate-800 focus:border-yellow-400/50 focus:ring-yellow-400/20 text-white rounded-xl h-12"
                                />
                            </div>

                            <div>
                                <Label htmlFor="telefone" className="text-slate-400 font-bold mb-2 block">Telefone</Label>
                                <Input
                                    id="telefone"
                                    type="tel"
                                    value={formData.telefone}
                                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                    className="bg-slate-900/50 border-slate-800 focus:border-yellow-400/50 focus:ring-yellow-400/20 text-white rounded-xl h-12"
                                />
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-slate-400 font-bold mb-2 block">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="bg-slate-900/50 border-slate-800 focus:border-yellow-400/50 focus:ring-yellow-400/20 text-white rounded-xl h-12"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="morada" className="text-slate-400 font-bold mb-2 block">Morada</Label>
                                <Input
                                    id="morada"
                                    value={formData.morada}
                                    onChange={(e) => setFormData({ ...formData, morada: e.target.value })}
                                    className="bg-slate-900/50 border-slate-800 focus:border-yellow-400/50 focus:ring-yellow-400/20 text-white rounded-xl h-12"
                                />
                            </div>

                            {/* Campos de Formação */}
                            {isFormacao && (
                                <>
                                    <div className="md:col-span-2 pt-6 border-t border-slate-800">
                                        <h4 className="font-black text-yellow-500 uppercase tracking-[0.2em] text-[10px] mb-6">Dados de Formação</h4>
                                    </div>

                                    <div>
                                        <Label htmlFor="escola" className="text-slate-400 font-bold mb-2 block">Escola</Label>
                                        <Input
                                            id="escola"
                                            value={formData.escola}
                                            onChange={(e) => setFormData({ ...formData, escola: e.target.value })}
                                            className="bg-slate-900/50 border-slate-800 text-white rounded-xl h-12"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="cartaoCidadao" className="text-slate-400 font-bold mb-2 block">CC / BI</Label>
                                        <Input
                                            id="cartaoCidadao"
                                            value={formData.cartaoCidadao}
                                            onChange={(e) => setFormData({ ...formData, cartaoCidadao: e.target.value })}
                                            className="bg-slate-900/50 border-slate-800 text-white rounded-xl h-12"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="nomePai" className="text-slate-400 font-bold mb-2 block">Nome do Pai</Label>
                                        <Input
                                            id="nomePai"
                                            value={formData.nomePai}
                                            onChange={(e) => setFormData({ ...formData, nomePai: e.target.value })}
                                            className="bg-slate-900/50 border-slate-800 text-white rounded-xl h-12"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="telefonePai" className="text-slate-400 font-bold mb-2 block">Telefone Pai</Label>
                                        <Input
                                            id="telefonePai"
                                            type="tel"
                                            value={formData.telefonePai}
                                            onChange={(e) => setFormData({ ...formData, telefonePai: e.target.value })}
                                            className="bg-slate-900/50 border-slate-800 text-white rounded-xl h-12"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="nomeMae" className="text-slate-400 font-bold mb-2 block">Nome da Mãe</Label>
                                        <Input
                                            id="nomeMae"
                                            value={formData.nomeMae}
                                            onChange={(e) => setFormData({ ...formData, nomeMae: e.target.value })}
                                            className="bg-slate-900/50 border-slate-800 text-white rounded-xl h-12"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="telefoneMae" className="text-slate-400 font-bold mb-2 block">Telefone Mãe</Label>
                                        <Input
                                            id="telefoneMae"
                                            type="tel"
                                            value={formData.telefoneMae}
                                            onChange={(e) => setFormData({ ...formData, telefoneMae: e.target.value })}
                                            className="bg-slate-900/50 border-slate-800 text-white rounded-xl h-12"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-slate-800 sticky bottom-0 bg-[#1e293b] py-4">
                            <button
                                type="button"
                                onClick={handleCloseDialog}
                                className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                            >
                                {editingAtleta ? 'Guardar Alterações' : 'Criar Atleta'}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

