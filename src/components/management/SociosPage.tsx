import { useState } from 'react';
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
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
import type { Socio, QuotasPorAno } from '@/lib/managementTypes';
import { cn } from '@/lib/utils';

const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const SociosPage = () => {
    const [socios, setSocios] = useLocalStorage<Socio[]>('pdl-socios', []);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isQuotasDialogOpen, setIsQuotasDialogOpen] = useState(false);
    const [editingSocio, setEditingSocio] = useState<Socio | null>(null);
    const [quotasSocio, setQuotasSocio] = useState<Socio | null>(null);
    const [quotasYear, setQuotasYear] = useState(new Date().getFullYear());

    const [formData, setFormData] = useState<Partial<Socio>>({
        nome: '',
        telefone: '',
        email: '',
        morada: '',
        quotaMensal: 0,
    });

    const filteredSocios = socios.filter(socio =>
        socio.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getNextNumeroSocio = () => {
        if (socios.length === 0) return 1;
        return Math.max(...socios.map(s => s.numeroSocio)) + 1;
    };

    const handleOpenDialog = (socio?: Socio) => {
        if (socio) {
            setEditingSocio(socio);
            setFormData(socio);
        } else {
            setEditingSocio(null);
            setFormData({
                nome: '',
                telefone: '',
                email: '',
                morada: '',
                quotaMensal: 0,
            });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingSocio(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const now = new Date().toISOString();
        if (editingSocio) {
            setSocios(socios.map(s =>
                s.id === editingSocio.id
                    ? { ...formData, id: s.id, numeroSocio: s.numeroSocio, quotas: s.quotas, createdAt: s.createdAt, updatedAt: now } as Socio
                    : s
            ));
        } else {
            const newSocio: Socio = {
                ...formData,
                id: crypto.randomUUID(),
                numeroSocio: getNextNumeroSocio(),
                quotas: {},
                createdAt: now,
                updatedAt: now,
            } as Socio;
            setSocios([...socios, newSocio]);
        }
        handleCloseDialog();
    };

    const handleDelete = (id: string) => {
        if (confirm('Tem a certeza que deseja eliminar este sócio?')) {
            setSocios(socios.filter(s => s.id !== id));
        }
    };

    const handleOpenQuotas = (socio: Socio) => {
        setQuotasSocio(socio);
        setQuotasYear(new Date().getFullYear());
        setIsQuotasDialogOpen(true);
    };

    const toggleQuota = (mes: number) => {
        if (!quotasSocio) return;
        const yearStr = quotasYear.toString();
        const mesStr = mes.toString();
        const updatedSocio = { ...quotasSocio };
        if (!updatedSocio.quotas[yearStr]) {
            updatedSocio.quotas[yearStr] = {};
        }
        updatedSocio.quotas[yearStr][mesStr] = !updatedSocio.quotas[yearStr][mesStr];
        updatedSocio.updatedAt = new Date().toISOString();
        setSocios(socios.map(s => s.id === quotasSocio.id ? updatedSocio : s));
        setQuotasSocio(updatedSocio);
    };

    const getQuotaStatus = (mes: number) => {
        if (!quotasSocio) return false;
        const yearStr = quotasYear.toString();
        const mesStr = mes.toString();
        return quotasSocio.quotas[yearStr]?.[mesStr] || false;
    };

    const countPaidQuotas = (socio: Socio) => {
        const currentYear = new Date().getFullYear().toString();
        const quotasAno = socio.quotas[currentYear] || {};
        return Object.values(quotasAno).filter(Boolean).length;
    };

    const hasOverdueQuotas = (socio: Socio) => {
        const now = new Date();
        const currentYear = now.getFullYear().toString();
        const currentMonth = now.getMonth() + 1;
        const quotasAno = socio.quotas[currentYear] || {};
        for (let mes = 1; mes <= currentMonth; mes++) {
            if (!quotasAno[mes.toString()]) return true;
        }
        return false;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tight">Sócios</h2>
                    <p className="text-slate-400 mt-1 font-medium">
                        {socios.length} sócio{socios.length !== 1 ? 's' : ''} registado{socios.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={() => handleOpenDialog()}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                >
                    <Plus className="h-5 w-5" />
                    Novo Sócio
                </button>
            </div>

            {/* Search */}
            <Card className="bg-[#1e293b] border-slate-800/50 shadow-xl p-6 rounded-3xl">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-400 transition-colors h-5 w-5" />
                    <Input
                        placeholder="Pesquisar por nome ou número..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-900/50 border-slate-800 focus:border-yellow-400/50 focus:ring-yellow-400/20 text-white pl-12 h-12 rounded-xl transition-all"
                    />
                </div>
            </Card>

            {/* Socios List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSocios.map(socio => {
                    const paidQuotas = countPaidQuotas(socio);
                    const isOverdue = hasOverdueQuotas(socio);

                    return (
                        <Card key={socio.id} className={cn(
                            "bg-[#1e293b] border-slate-800/50 hover:border-yellow-400/30 transition-all duration-300 group overflow-hidden rounded-3xl relative",
                            isOverdue && "border-red-500/50"
                        )}>
                            <div className={cn(
                                "absolute top-0 left-0 w-1 h-full transition-transform duration-300",
                                isOverdue ? "bg-red-500" : "bg-emerald-500"
                            )} />
                            <CardHeader className="pb-3 px-6 pt-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black font-mono bg-slate-800 text-slate-400 px-2 py-1 rounded-lg uppercase tracking-tight">
                                                #{socio.numeroSocio.toString().padStart(4, '0')}
                                            </span>
                                            {isOverdue && (
                                                <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black uppercase">Em Atraso</span>
                                            )}
                                        </div>
                                        <CardTitle className="text-xl font-bold text-white mt-2 group-hover:text-yellow-400 transition-colors">{socio.nome}</CardTitle>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenDialog(socio)}
                                            className="p-2 bg-slate-800/50 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-xl transition-all"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(socio.id)}
                                            className="p-2 bg-slate-800/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="px-6 pb-6 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-sm text-slate-400">
                                        <Search className="w-4 h-4 text-slate-500" />
                                        <span className="truncate">{socio.email || 'Sem email'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-400">
                                        <Plus className="w-4 h-4 text-slate-500" />
                                        <span>{socio.telefone || 'Sem telefone'}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-800 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Quotas (Ano)</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-black text-white">{paidQuotas}/12</span>
                                            <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500" style={{ width: `${(paidQuotas / 12) * 100}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Mensalidade</p>
                                        <span className="text-lg font-black text-yellow-400">€{socio.quotaMensal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleOpenQuotas(socio)}
                                    className="w-full mt-2 py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Calendar className="h-4 w-4 text-yellow-500" />
                                    Gerir Pagamentos
                                </button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {filteredSocios.length === 0 && (
                <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
                    <Search className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Nenhum sócio encontrado</p>
                </div>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl bg-[#1e293b] border-slate-800 text-white rounded-3xl shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-white">
                            {editingSocio ? 'Editar Sócio' : 'Novo Sócio'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            {editingSocio
                                ? `Nº Sócio: #${editingSocio.numeroSocio.toString().padStart(4, '0')}`
                                : `Nº Sócio: #${getNextNumeroSocio().toString().padStart(4, '0')} (atribuído automaticamente)`
                            }
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

                            <div>
                                <Label htmlFor="quotaMensal" className="text-slate-400 font-bold mb-2 block">Quota Mensal (€) *</Label>
                                <Input
                                    id="quotaMensal"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                    value={formData.quotaMensal}
                                    onChange={(e) => setFormData({ ...formData, quotaMensal: parseFloat(e.target.value) || 0 })}
                                    className="bg-slate-900/50 border-slate-800 focus:border-yellow-400/50 focus:ring-yellow-400/20 text-white rounded-xl h-12"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
                            <button
                                type="button"
                                onClick={handleCloseDialog}
                                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                            >
                                {editingSocio ? 'Guardar Alterações' : 'Criar Sócio'}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Quotas Calendar Dialog */}
            <Dialog open={isQuotasDialogOpen} onOpenChange={setIsQuotasDialogOpen}>
                <DialogContent className="max-w-3xl bg-[#1e293b] border-slate-800 text-white rounded-3xl shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-white">
                            Gestão de Quotas - <span className="text-yellow-400">{quotasSocio?.nome}</span>
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Registo de pagamentos mensais
                        </DialogDescription>
                    </DialogHeader>

                    {quotasSocio && (
                        <div className="space-y-8 mt-4">
                            {/* Year Navigation */}
                            <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                                <button
                                    onClick={() => setQuotasYear(quotasYear - 1)}
                                    className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <h3 className="text-3xl font-black text-white tracking-tighter">{quotasYear}</h3>
                                <button
                                    onClick={() => setQuotasYear(quotasYear + 1)}
                                    className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {meses.map((mes, index) => {
                                    const mesNum = index + 1;
                                    const isPaid = getQuotaStatus(mesNum);

                                    return (
                                        <button
                                            key={mes}
                                            type="button"
                                            onClick={() => toggleQuota(mesNum)}
                                            className={cn(
                                                "relative group p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden",
                                                isPaid
                                                    ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                                    : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                                            )}
                                        >
                                            {isPaid && <div className="absolute top-0 right-0 p-1"><Plus className="w-3 h-3 rotate-45" /></div>}
                                            <div className="text-xs font-black uppercase tracking-widest">{mes.substring(0, 3)}</div>
                                            <div className="text-sm font-bold mt-1">
                                                {isPaid ? 'PAGO' : 'PENDENTE'}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Summary */}
                            <div className="bg-yellow-400 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-black">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-black/10 rounded-xl flex items-center justify-center">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Meses Liquidados</p>
                                        <p className="text-2xl font-black">{Object.values(quotasSocio.quotas[quotasYear.toString()] || {}).filter(Boolean).length} de 12</p>
                                    </div>
                                </div>
                                <div className="text-center sm:text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Pago no Ano</p>
                                    <p className="text-3xl font-black">€{(Object.values(quotasSocio.quotas[quotasYear.toString()] || {}).filter(Boolean).length * quotasSocio.quotaMensal).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={() => setIsQuotasDialogOpen(false)}
                            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
                        >
                            Fechar
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

