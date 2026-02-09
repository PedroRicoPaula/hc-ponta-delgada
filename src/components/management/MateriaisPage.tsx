import { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
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
import type { Material, MaterialCategoria, MaterialTipo, MaterialEstado, Atleta, Escalao } from '@/lib/managementTypes';
import { cn } from '@/lib/utils';
import { initialAtletas } from './managementData';

const escaloes: { value: Escalao; label: string }[] = [
    { value: 'sub11', label: 'Sub 11' },
    { value: 'sub13', label: 'Sub 13' },
    { value: 'sub15', label: 'Sub 15' },
    { value: 'sub17', label: 'Sub 17' },
    { value: 'sub19', label: 'Sub 19' },
    { value: 'seniores', label: 'Seniores' },
];

const categorias: { value: MaterialCategoria; label: string }[] = [
    { value: 'atleta', label: 'Atleta' },
    { value: 'guarda-redes', label: 'Guarda-Redes' },
    { value: 'pequeno-material', label: 'Pequeno Material' },
];

const tipos: { value: MaterialTipo; label: string }[] = [
    { value: 'stick', label: 'Stick' },
    { value: 'luvas', label: 'Luvas' },
    { value: 'caneleiras', label: 'Caneleiras' },
    { value: 'patins', label: 'Patins' },
    { value: 'capacete', label: 'Capacete' },
    { value: 'cotoveleiras', label: 'Cotoveleiras' },
    { value: 'joelheiras', label: 'Joelheiras' },
    { value: 'bola', label: 'Bola' },
    { value: 'cones', label: 'Cones' },
    { value: 'coletes', label: 'Coletes' },
    { value: 'outro', label: 'Outro' },
];

const estados: { value: MaterialEstado; label: string; color: string }[] = [
    { value: 'livre', label: 'Livre', color: 'green' },
    { value: 'atribuido', label: 'Atribuído', color: 'blue' },
    { value: 'danificado', label: 'Danificado', color: 'red' },
];

export const MateriaisPage = () => {
    const [materiais, setMateriais] = useLocalStorage<Material[]>('pdl-materiais', []);
    const [atletas] = useLocalStorage<Atleta[]>('pdl-atletas', initialAtletas);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState<string>('all');
    const [filterCategoria, setFilterCategoria] = useState<string>('all');
    const [atletaFilterEscalao, setAtletaFilterEscalao] = useState<string>('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

    const [formData, setFormData] = useState<Partial<Material>>({
        categoria: 'atleta',
        tipo: 'stick',
        marca: '',
        tamanho: '',
        numero: '',
        estado: 'livre',
        atletaId: undefined,
    });

    const filteredMateriais = materiais.filter(material => {
        const matchesSearch =
            material.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            material.categoria.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesEstado = filterEstado === 'all' || material.estado === filterEstado;
        const matchesCategoria = filterCategoria === 'all' || material.categoria === filterCategoria;
        return matchesSearch && matchesEstado && matchesCategoria;
    });

    const getAtletaNome = (atletaId?: string) => {
        if (!atletaId) return '-';
        const atleta = atletas.find(a => a.id === atletaId);
        return atleta?.nome || 'Atleta não encontrado';
    };

    const handleOpenDialog = (material?: Material) => {
        setAtletaFilterEscalao('all');
        if (material) {
            setEditingMaterial(material);
            setFormData(material);
        } else {
            const nextNumero = materiais.length > 0
                ? Math.max(...materiais.map(m => parseInt(m.numero || '0')).filter(n => !isNaN(n))) + 1
                : 1;
            setEditingMaterial(null);
            setFormData({
                categoria: 'atleta',
                tipo: 'stick',
                marca: '',
                tamanho: '',
                numero: nextNumero.toString(),
                estado: 'livre',
                atletaId: undefined,
            });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingMaterial(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const now = new Date().toISOString();
        const finalData = {
            ...formData,
            atletaId: formData.estado === 'atribuido' ? formData.atletaId : undefined,
        };

        if (editingMaterial) {
            setMateriais(materiais.map(m =>
                m.id === editingMaterial.id
                    ? { ...finalData, id: m.id, createdAt: m.createdAt, updatedAt: now } as Material
                    : m
            ));
        } else {
            const newMaterial: Material = {
                ...finalData,
                id: crypto.randomUUID(),
                createdAt: now,
                updatedAt: now,
            } as Material;
            setMateriais([...materiais, newMaterial]);
        }
        handleCloseDialog();
    };

    const handleDelete = (id: string) => {
        if (confirm('Tem a certeza que deseja eliminar este material?')) {
            setMateriais(materiais.filter(m => m.id !== id));
        }
    };

    const getEstadoInfo = (estado: MaterialEstado) => {
        const e = estados.find(s => s.value === estado);
        return e || { label: estado, color: 'gray' };
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Materiais</h2>
                    <p className="text-slate-400 mt-1 font-medium">
                        {materiais.length} {materiais.length !== 1 ? 'itens' : 'item'} no inventário
                    </p>
                </div>
                <button
                    onClick={() => handleOpenDialog()}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                >
                    <Plus className="h-5 w-5" />
                    Novo Material
                </button>
            </div>

            {/* Filters */}
            <Card className="bg-[#1e293b] border-slate-800/50 shadow-xl p-6 rounded-3xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-400 transition-colors h-5 w-5" />
                        <Input
                            placeholder="Tipo ou categoria..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-900/50 border-slate-800 focus:border-yellow-400/50 focus:ring-yellow-400/20 text-white pl-12 h-12 rounded-xl"
                        />
                    </div>
                    <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-800 h-12 rounded-xl text-slate-300">
                            <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                            <SelectItem value="all">Todas as Categorias</SelectItem>
                            {categorias.map(c => (
                                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={filterEstado} onValueChange={setFilterEstado}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-800 h-12 rounded-xl text-slate-300">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                            <SelectItem value="all">Todos os Estados</SelectItem>
                            {estados.map(e => (
                                <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            {/* Materials List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMateriais.map(material => {
                    const info = getEstadoInfo(material.estado);
                    const colorClass =
                        info.color === 'green' ? 'text-emerald-400' :
                            info.color === 'blue' ? 'text-blue-400' :
                                'text-red-400';
                    const bgClass =
                        info.color === 'green' ? 'bg-emerald-500/10' :
                            info.color === 'blue' ? 'bg-blue-500/10' :
                                'bg-red-500/10';

                    return (
                        <Card key={material.id} className="bg-[#1e293b] border-slate-800/50 hover:border-yellow-400/30 transition-all duration-300 group rounded-3xl overflow-hidden relative">
                            <CardHeader className="pb-3 px-6 pt-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-4">
                                        <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", bgClass, colorClass)}>
                                            <Package className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-white capitalize group-hover:text-yellow-400 transition-colors">
                                                {material.tipo}
                                            </CardTitle>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                    {material.categoria.replace('-', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenDialog(material)}
                                            className="p-2 bg-slate-800/50 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-xl transition-all"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(material.id)}
                                            className="p-2 bg-slate-800/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="px-6 pb-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {material.marca && (
                                        <div className="bg-slate-900/40 p-3 rounded-2xl border border-slate-800/50">
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Marca</p>
                                            <p className="text-sm font-bold text-slate-300">{material.marca}</p>
                                        </div>
                                    )}
                                    {material.tamanho && (
                                        <div className="bg-slate-900/40 p-3 rounded-2xl border border-slate-800/50">
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Tamanho</p>
                                            <p className="text-sm font-bold text-slate-300">{material.tamanho}</p>
                                        </div>
                                    )}
                                    {material.numero && (
                                        <div className="bg-slate-900/40 p-3 rounded-2xl border border-slate-800/50 col-span-2">
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Número ID</p>
                                            <p className="text-sm font-bold text-slate-300"># {material.numero}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-2">
                                    <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter", bgClass, colorClass)}>
                                        <div className={cn("w-1.5 h-1.5 rounded-full", info.color === 'green' ? 'bg-emerald-400' : info.color === 'blue' ? 'bg-blue-400' : 'bg-red-400')} />
                                        {info.label}
                                    </div>
                                </div>

                                {material.estado === 'atribuido' && material.atletaId && (
                                    <div className="pt-4 border-t border-slate-800">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Atribuído a</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                                <Search className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-200">{getAtletaNome(material.atletaId)}</span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {filteredMateriais.length === 0 && (
                <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
                    <Package className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Nenhum material encontrado</p>
                </div>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    className="w-full sm:w-[95vw] md:max-w-2xl bg-[#1e293b] border-slate-800 text-white rounded-none sm:rounded-3xl shadow-2xl p-0 overflow-hidden h-full sm:h-auto sm:max-h-[90vh]"
                >
                    <DialogHeader className="p-5 sm:p-8 pb-0">
                        <DialogTitle className="text-xl sm:text-2xl font-black text-white">
                            {editingMaterial ? 'Editar Material' : 'Novo Material'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 text-sm">
                            Gestão de inventário e atribuições
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden h-[calc(100vh-80px)] sm:h-auto">
                        <div className="p-5 sm:p-8 pt-4 space-y-6 overflow-y-auto custom-scrollbar flex-1 sm:max-h-[70vh]">
                            <div className="grid grid-cols-1 gap-6">
                                {/* Categoria e Tipo em uma linha */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="categoria" className="text-slate-500 font-bold ml-1 text-[10px] uppercase tracking-widest">Categoria *</Label>
                                        <Select
                                            value={formData.categoria}
                                            onValueChange={(value: MaterialCategoria) => setFormData({ ...formData, categoria: value })}
                                        >
                                            <SelectTrigger className="bg-slate-900 border-slate-800 text-white rounded-xl h-12">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                                                {categorias.map(c => (
                                                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tipo" className="text-slate-500 font-bold ml-1 text-[10px] uppercase tracking-widest">Tipo *</Label>
                                        <Select
                                            value={formData.tipo}
                                            onValueChange={(value: MaterialTipo) => setFormData({ ...formData, tipo: value })}
                                        >
                                            <SelectTrigger className="bg-slate-900 border-slate-800 text-white rounded-xl h-12">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                                                {tipos.map(t => (
                                                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="marca" className="text-slate-500 font-bold ml-1 text-[10px] uppercase tracking-widest">Marca</Label>
                                    <Input
                                        id="marca"
                                        value={formData.marca || ''}
                                        onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                                        className="bg-slate-900 border-slate-800 text-white rounded-xl h-12"
                                        placeholder="Ex: Azemad, Reno, etc."
                                    />
                                </div>

                                {/* Estado e Tamanho em uma linha */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="estado" className="text-slate-500 font-bold ml-1 text-[10px] uppercase tracking-widest">Estado *</Label>
                                        <Select
                                            value={formData.estado}
                                            onValueChange={(value: MaterialEstado) => setFormData({ ...formData, estado: value })}
                                        >
                                            <SelectTrigger className="bg-slate-900 border-slate-800 text-white rounded-xl h-12">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                                                {estados.map(e => (
                                                    <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tamanho" className="text-slate-500 font-bold ml-1 text-[10px] uppercase tracking-widest">Tamanho</Label>
                                        <Input
                                            id="tamanho"
                                            value={formData.tamanho}
                                            onChange={(e) => setFormData({ ...formData, tamanho: e.target.value })}
                                            className="bg-slate-900 border-slate-800 text-white rounded-xl h-12"
                                            placeholder="Ex: M, 42, etc."
                                        />
                                    </div>
                                </div>

                                {formData.estado === 'atribuido' && (
                                    <div className="space-y-4 pt-4 border-t border-slate-800/50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-slate-500 font-bold ml-1 text-[10px] uppercase tracking-widest">Filtrar Escalão</Label>
                                                <Select
                                                    value={atletaFilterEscalao}
                                                    onValueChange={setAtletaFilterEscalao}
                                                >
                                                    <SelectTrigger className="bg-slate-900 border-slate-800 text-white rounded-xl h-12">
                                                        <SelectValue placeholder="Todos os Escalões" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                                                        <SelectItem value="all">Todos os Escalões</SelectItem>
                                                        {escaloes.map(e => (
                                                            <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="atletaId" className="text-slate-500 font-bold ml-1 text-[10px] uppercase tracking-widest">Selecionar Atleta *</Label>
                                                <Select
                                                    value={formData.atletaId}
                                                    onValueChange={(value) => setFormData({ ...formData, atletaId: value })}
                                                >
                                                    <SelectTrigger className="bg-slate-900 border-slate-800 text-white rounded-xl h-12">
                                                        <SelectValue placeholder="Selecione um atleta" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                                                        {atletas
                                                            .filter(a => atletaFilterEscalao === 'all' || a.escalao === atletaFilterEscalao)
                                                            .map(atleta => (
                                                                <SelectItem key={atleta.id} value={atleta.id}>
                                                                    {atleta.nome} ({atleta.escalao.replace('sub', 'Sub ')})
                                                                </SelectItem>
                                                            ))}
                                                        {atletas.filter(a => atletaFilterEscalao === 'all' || a.escalao === atletaFilterEscalao).length === 0 && (
                                                            <SelectItem value="none" disabled>Nenhum atleta encontrado</SelectItem>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 p-5 sm:p-8 pt-4 sm:pt-6 border-t border-slate-800 bg-[#1e293b] mt-auto">
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
                                {editingMaterial ? 'Guardar' : 'Criar Material'}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

