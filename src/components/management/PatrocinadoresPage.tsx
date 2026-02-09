import { useState } from 'react';
import { Plus, Search, Edit, Trash2, ExternalLink, Upload, X } from 'lucide-react';
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
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Patrocinador } from '@/lib/managementTypes';
import { initialPatrocinadores } from './managementData';

export const PatrocinadoresPage = () => {
    const [patrocinadores, setPatrocinadores] = useLocalStorage<Patrocinador[]>('pdl-patrocinadores', initialPatrocinadores);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPatrocinador, setEditingPatrocinador] = useState<Patrocinador | null>(null);

    const [formData, setFormData] = useState<Partial<Patrocinador>>({
        nome: '',
        logotipo: undefined,
        website: '',
        telefone: '',
        email: '',
        contribuicao: 0,
        dataInicio: '',
        dataFim: '',
        notas: '',
    });

    const filteredPatrocinadores = patrocinadores.filter(p =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenDialog = (patrocinador?: Patrocinador) => {
        if (patrocinador) {
            setEditingPatrocinador(patrocinador);
            setFormData(patrocinador);
        } else {
            setEditingPatrocinador(null);
            setFormData({
                nome: '',
                logotipo: undefined,
                website: '',
                telefone: '',
                email: '',
                contribuicao: 0,
                dataInicio: '',
                dataFim: '',
                notas: '',
            });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingPatrocinador(null);
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.match(/^image\/(png|svg\+xml)$/)) {
            alert('Por favor, selecione apenas ficheiros PNG ou SVG');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert('O ficheiro é demasiado grande. Tamanho máximo: 2MB');
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            setFormData({ ...formData, logotipo: base64 });
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveLogo = () => {
        setFormData({ ...formData, logotipo: undefined });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const now = new Date().toISOString();
        if (editingPatrocinador) {
            setPatrocinadores(patrocinadores.map(p =>
                p.id === editingPatrocinador.id
                    ? { ...formData, id: p.id, createdAt: p.createdAt, updatedAt: now } as Patrocinador
                    : p
            ));
        } else {
            const newPatrocinador: Patrocinador = {
                ...formData,
                id: crypto.randomUUID(),
                createdAt: now,
                updatedAt: now,
            } as Patrocinador;
            setPatrocinadores([...patrocinadores, newPatrocinador]);
        }
        handleCloseDialog();
    };

    const handleDelete = (id: string) => {
        if (confirm('Tem a certeza que deseja eliminar este patrocinador?')) {
            setPatrocinadores(patrocinadores.filter(p => p.id !== id));
        }
    };

    const totalContribuicoes = patrocinadores.reduce((sum, p) => sum + p.contribuicao, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Patrocinadores</h2>
                    <p className="text-slate-400 mt-1 font-medium">
                        {patrocinadores.length} parceiro{patrocinadores.length !== 1 ? 's' : ''} •
                        <span className="text-yellow-400 ml-1">Total: €{totalContribuicoes.toFixed(2)}</span>
                    </p>
                </div>
                <button
                    onClick={() => handleOpenDialog()}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                >
                    <Plus className="h-5 w-5" />
                    Novo Patrocinador
                </button>
            </div>

            {/* Search */}
            <Card className="bg-[#1e293b] border-slate-800/50 shadow-xl p-6 rounded-3xl">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-400 transition-colors h-5 w-5" />
                    <Input
                        placeholder="Pesquisar por nome da empresa..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-900/50 border-slate-800 focus:border-yellow-400/50 focus:ring-yellow-400/20 text-white pl-12 h-12 rounded-xl"
                    />
                </div>
            </Card>

            {/* Sponsors List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatrocinadores.map(patrocinador => (
                    <Card key={patrocinador.id} className="bg-[#1e293b] border-slate-800/50 hover:border-yellow-400/30 transition-all duration-300 group rounded-3xl overflow-hidden relative">
                        <CardHeader className="pb-3 px-6 pt-6">
                            <div className="flex justify-between items-start gap-4">
                                {patrocinador.logotipo ? (
                                    <div className="w-20 h-20 flex-shrink-0 bg-white shadow-inner rounded-2xl p-3 flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <img
                                            src={patrocinador.logotipo}
                                            alt={patrocinador.nome}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 flex-shrink-0 bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-[10px] uppercase font-black tracking-widest leading-tight text-center px-2 group-hover:bg-slate-800 transition-colors">
                                        Sem logo
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <CardTitle className="text-xl font-bold text-white truncate group-hover:text-yellow-400 transition-colors">
                                        {patrocinador.nome}
                                    </CardTitle>
                                    <p className="text-2xl font-black text-yellow-400 mt-1">
                                        €{patrocinador.contribuicao.toFixed(0)}
                                    </p>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Contribuição Anual</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => handleOpenDialog(patrocinador)}
                                        className="p-2 bg-slate-800/50 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-xl transition-all"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(patrocinador.id)}
                                        className="p-2 bg-slate-800/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 pb-6 space-y-4">
                            <div className="grid grid-cols-1 gap-3">
                                {patrocinador.website && (
                                    <a
                                        href={patrocinador.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 px-4 py-3 bg-slate-900/40 hover:bg-slate-900 border border-slate-800/50 rounded-2xl transition-all group/link"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover/link:text-blue-300">
                                            <ExternalLink className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-400 group-hover/link:text-slate-200 truncate">Website Oficial</span>
                                    </a>
                                )}
                                <div className="p-4 bg-slate-900/20 rounded-2xl border border-slate-800/50 space-y-2">
                                    {patrocinador.email && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <Plus className="w-4 h-4 text-slate-500" />
                                            <span className="text-slate-300 truncate">{patrocinador.email}</span>
                                        </div>
                                    )}
                                    {patrocinador.telefone && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <Search className="w-4 h-4 text-slate-500" />
                                            <span className="text-slate-300">{patrocinador.telefone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-slate-600">Duração do Contrato</span>
                                <div className="text-right">
                                    <span className="text-slate-400">{new Date(patrocinador.dataInicio).toLocaleDateString('pt-PT')}</span>
                                    {patrocinador.dataFim && (
                                        <>
                                            <span className="mx-2 text-slate-700">→</span>
                                            <span className="text-slate-400">{new Date(patrocinador.dataFim).toLocaleDateString('pt-PT')}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredPatrocinadores.length === 0 && (
                <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
                    <Search className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Nenhum patrocinador encontrado</p>
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
                            {editingPatrocinador ? 'Editar Patrocinador' : 'Novo Patrocinador'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 text-sm">
                            Gestão de parcerias e patrocínios
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden h-[calc(100vh-80px)] sm:h-auto">
                        <div className="p-5 sm:p-8 pt-4 space-y-6 overflow-y-auto custom-scrollbar flex-1 sm:max-h-[70vh]">
                            {/* Logo Upload */}
                            <div>
                                <Label className="text-slate-400 font-bold mb-4 block">Logótipo da Empresa</Label>
                                <div className="mt-2">
                                    {formData.logotipo ? (
                                        <div className="relative inline-block group">
                                            <div className="w-40 h-40 bg-white border-2 border-slate-700 rounded-3xl p-4 flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={formData.logotipo}
                                                    alt="Preview"
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRemoveLogo}
                                                className="absolute -top-3 -right-3 h-8 w-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 active:scale-90"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            <label className="cursor-pointer group">
                                                <div className="flex flex-col items-center justify-center gap-3 p-8 bg-slate-900/50 hover:bg-slate-900 border-2 border-dashed border-slate-800 hover:border-yellow-400/50 rounded-3xl transition-all">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 group-hover:scale-110 transition-transform">
                                                        <Upload className="h-6 w-6" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm font-bold text-slate-300">Carregar Logótipo</p>
                                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">PNG ou SVG (Máx. 2MB)</p>
                                                    </div>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/png,image/svg+xml"
                                                    onChange={handleLogoUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <Label htmlFor="nome" className="text-slate-400 font-bold mb-2 block">Nome da Empresa *</Label>
                                    <Input
                                        id="nome"
                                        required
                                        value={formData.nome}
                                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                        className="bg-slate-900/50 border-slate-800 text-white rounded-xl h-12"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="website" className="text-slate-400 font-bold mb-2 block">Website</Label>
                                    <Input
                                        id="website"
                                        type="url"
                                        placeholder="https://..."
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        className="bg-slate-900/50 border-slate-800 text-white rounded-xl h-12"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="contribuicao" className="text-slate-400 font-bold mb-2 block">Contribuição Anual (€) *</Label>
                                    <Input
                                        id="contribuicao"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        required
                                        value={formData.contribuicao}
                                        onChange={(e) => setFormData({ ...formData, contribuicao: parseFloat(e.target.value) || 0 })}
                                        className="bg-slate-900/50 border-slate-800 text-white rounded-xl h-12 font-black text-yellow-400"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="telefone" className="text-slate-400 font-bold mb-2 block">Telefone de Contacto</Label>
                                    <Input
                                        id="telefone"
                                        type="tel"
                                        value={formData.telefone}
                                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                        className="bg-slate-900/50 border-slate-800 text-white rounded-xl h-12"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="email" className="text-slate-400 font-bold mb-2 block">Email de Contacto</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="bg-slate-900/50 border-slate-800 text-white rounded-xl h-12"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="dataInicio" className="text-slate-400 font-bold mb-2 block">Data de Início *</Label>
                                    <Input
                                        id="dataInicio"
                                        type="date"
                                        required
                                        value={formData.dataInicio}
                                        onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                                        className="bg-slate-900/50 border-slate-800 text-white rounded-xl h-12 [color-scheme:dark]"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="dataFim" className="text-slate-400 font-bold mb-2 block">Data de Fim</Label>
                                    <Input
                                        id="dataFim"
                                        type="date"
                                        value={formData.dataFim}
                                        onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                                        className="bg-slate-900/50 border-slate-800 text-white rounded-xl h-12 [color-scheme:dark]"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="notas" className="text-slate-400 font-bold mb-2 block">Notas Adicionais</Label>
                                    <Textarea
                                        id="notas"
                                        rows={3}
                                        value={formData.notas}
                                        onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                                        className="bg-slate-900/50 border-slate-800 text-white rounded-2xl p-4 min-h-[100px]"
                                        placeholder="Ex: Contrapartidas, periodicidade de pagamentos..."
                                    />
                                </div>
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
                                {editingPatrocinador ? 'Guardar Alterações' : 'Confirmar Parceria'}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

