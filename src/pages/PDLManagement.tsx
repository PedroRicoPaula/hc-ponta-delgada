import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Users,
    Package,
    UserCheck,
    Handshake,
    Bus,
    Building2,
    LayoutDashboard,
    Menu,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type {
    Atleta,
    Socio,
    Material,
    Patrocinador,
    Viagem,
    MembroDirecao,
    DashboardStats
} from '@/lib/managementTypes';

// Import sub-pages (we'll create these next)
import { AtletasPage } from '../components/management/AtletasPage';
import { SociosPage } from '../components/management/SociosPage';
import { MateriaisPage } from '../components/management/MateriaisPage';
import { PatrocinadoresPage } from '../components/management/PatrocinadoresPage';
import { ViagensPage } from '../components/management/ViagensPage';
import { DirecaoPage } from '../components/management/DirecaoPage';

// Import initial data
import { initialAtletas, initialDirecao, initialPatrocinadores } from '@/components/management/managementData';

type ActivePage = 'dashboard' | 'atletas' | 'socios' | 'materiais' | 'patrocinadores' | 'viagens' | 'direcao';

const PDLManagement = () => {
    const [activePage, setActivePage] = useState<ActivePage>('dashboard');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Data stores
    const [atletas] = useLocalStorage<Atleta[]>('pdl-atletas', initialAtletas);
    const [socios] = useLocalStorage<Socio[]>('pdl-socios', []);
    const [materiais] = useLocalStorage<Material[]>('pdl-materiais', []);
    const [patrocinadores] = useLocalStorage<Patrocinador[]>('pdl-patrocinadores', initialPatrocinadores);
    const [viagens] = useLocalStorage<Viagem[]>('pdl-viagens', []);
    const [direcao] = useLocalStorage<MembroDirecao[]>('pdl-direcao', initialDirecao);

    // Calculate dashboard statistics
    const stats = useMemo<DashboardStats>(() => {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear().toString();

        const atletasPorEscalao = atletas.reduce((acc, atleta) => {
            acc[atleta.escalao] = (acc[atleta.escalao] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const materiaisLivres = materiais.filter(m => m.estado === 'livre').length;
        const materiaisAtribuidos = materiais.filter(m => m.estado === 'atribuido').length;
        const totalPatrocinios = patrocinadores.reduce((sum, p) => sum + p.contribuicao, 0);
        const viagensPlaneadas = viagens.filter(v => new Date(v.dataIda) >= now).length;
        const quotasPagasMesAtual = socios.filter(s =>
            s.quotas[currentYear]?.[currentMonth.toString()] === true
        ).length;

        const quotasCobradasAnoCorrente = socios.reduce((sum, socio) => {
            const quotasAno = socio.quotas[currentYear] || {};
            const mesesPagos = Object.values(quotasAno).filter(Boolean).length;
            return sum + (mesesPagos * socio.quotaMensal);
        }, 0);

        const sociosComQuotasEmAtraso = socios.filter(socio => {
            const quotasAno = socio.quotas[currentYear] || {};
            for (let mes = 1; mes <= currentMonth; mes++) {
                if (!quotasAno[mes.toString()]) return true;
            }
            return false;
        }).length;

        return {
            totalAtletas: atletas.length,
            totalMateriais: materiais.length,
            totalSocios: socios.length,
            totalPatrocinadores: patrocinadores.length,
            atletasPorEscalao: atletasPorEscalao as any,
            materiaisLivres,
            materiaisAtribuidos,
            totalPatrocinios,
            viagensPlaneadas,
            quotasPagasMesAtual,
            quotasTotaisMesAtual: socios.length,
            quotasCobradasAnoCorrente,
            sociosComQuotasEmAtraso,
        };
    }, [atletas, socios, materiais, patrocinadores, viagens]);

    const menuItems = [
        { id: 'dashboard' as ActivePage, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'atletas' as ActivePage, label: 'Atletas', icon: Users },
        { id: 'socios' as ActivePage, label: 'Sócios', icon: UserCheck },
        { id: 'materiais' as ActivePage, label: 'Materiais', icon: Package },
        { id: 'patrocinadores' as ActivePage, label: 'Patrocinadores', icon: Handshake },
        { id: 'viagens' as ActivePage, label: 'Viagens', icon: Bus },
        { id: 'direcao' as ActivePage, label: 'Direção', icon: Building2 },
    ];

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard': return <DashboardView stats={stats} />;
            case 'atletas': return <AtletasPage />;
            case 'socios': return <SociosPage />;
            case 'materiais': return <MateriaisPage />;
            case 'patrocinadores': return <PatrocinadoresPage />;
            case 'viagens': return <ViagensPage />;
            case 'direcao': return <DirecaoPage />;
            default: return <DashboardView stats={stats} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-yellow-400 selection:text-black">
            <Helmet>
                <title>Gestão PDL - Hóquei Clube Ponta Delgada</title>
                <meta name="description" content="Sistema de gestão interno do Hóquei Clube de Ponta Delgada" />
            </Helmet>

            <div className="flex h-screen overflow-hidden">
                {/* Sidebar - Desktop */}
                <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-[#1e293b] border-r border-slate-800/50 shadow-2xl z-20">
                    <div className="p-8 border-b border-slate-800/50">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                                <Building2 className="w-5 h-5 text-black" />
                            </div>
                            <h1 className="text-xl font-black tracking-tighter text-white">
                                PDL <span className="text-yellow-400">Gestão</span>
                            </h1>
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">Hóquei Clube PDL</p>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activePage === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActivePage(item.id)}
                                    className={`w-full group flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                        ? 'bg-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.15)] font-bold'
                                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                        }`}
                                >
                                    <Icon className={`mr-3 h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                    <span className="text-sm">{item.label}</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black/20" />}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-800/50">
                        <div className="bg-slate-800/50 rounded-xl p-4">
                            <p className="text-xs text-slate-500 mb-1">Acesso</p>
                            <p className="text-sm font-medium text-slate-200">Administrador</p>
                        </div>
                    </div>
                </aside>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                        <aside className="fixed left-0 top-0 bottom-0 w-72 bg-[#1e293b] shadow-2xl">
                            <div className="p-8 border-b border-slate-800/50 flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-black text-white">PDL <span className="text-yellow-400">Gestão</span></h1>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Dashboard</p>
                                </div>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <nav className="p-4 space-y-2 font-medium">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activePage === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            className={`w-full flex items-center px-4 py-4 rounded-2xl transition-all ${isActive ? 'bg-yellow-400 text-black' : 'text-slate-300 hover:bg-slate-800/50'}`}
                                            onClick={() => {
                                                setActivePage(item.id);
                                                setMobileMenuOpen(false);
                                            }}
                                        >
                                            <Icon className="mr-3 h-6 w-6" />
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </aside>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-[#0f172a] relative">
                    {/* Background decorations */}
                    <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none" />
                    <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

                    {/* Mobile Header */}
                    <div className="lg:hidden bg-[#1e293b]/90 backdrop-blur-xl border-b border-slate-800/50 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
                        <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-slate-400 hover:text-yellow-400 transition-colors">
                            <Menu className="h-6 w-6" />
                        </button>
                        <h1 className="text-base font-black text-white tracking-tight">PDL <span className="text-yellow-400">Gestão</span></h1>
                        <div className="w-10" />
                    </div>

                    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto relative z-10 w-full">
                        {renderPage()}
                    </div>
                </main>
            </div>
        </div>
    );
};

// Dashboard Component
const DashboardView = ({ stats }: { stats: DashboardStats }) => {
    const escaloes = ['sub11', 'sub13', 'sub15', 'sub17', 'sub19', 'seniores'] as const;
    const maxAtletas = Math.max(...escaloes.map(e => stats.atletasPorEscalao[e] || 0), 1);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-4xl font-black text-white tracking-tight">Dashboard</h2>
                <div className="flex items-center gap-2 mt-2">
                    <p className="text-slate-400 font-medium">Visão geral do desempenho do clube</p>
                    <div className="h-1 w-12 bg-yellow-400 rounded-full" />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-[#1e293b] border-slate-800/50 overflow-hidden relative group hover:scale-[1.02] transition-all duration-300">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-12 h-12 text-yellow-500" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">Total Atletas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-black text-white">{stats.totalAtletas}</div>
                        <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 w-2/3" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#1e293b] border-slate-800/50 overflow-hidden relative group hover:scale-[1.02] transition-all duration-300">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <UserCheck className="w-12 h-12 text-emerald-500" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">Total Sócios</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-black text-white">{stats.totalSocios}</div>
                        <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 w-1/4" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#1e293b] border-slate-800/50 overflow-hidden relative group hover:scale-[1.02] transition-all duration-300">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Package className="w-12 h-12 text-violet-500" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">Total Materiais</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-black text-white">{stats.totalMateriais}</div>
                        <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-violet-400 w-1/2" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#1e293b] border-slate-800/50 overflow-hidden relative group hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-yellow-400/5">
                    <div className="absolute inset-0 bg-yellow-400/[0.02] group-hover:bg-yellow-400/[0.04] transition-colors" />
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Handshake className="w-12 h-12 text-yellow-400" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-yellow-500">Patrocinadores</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-black text-white">{stats.totalPatrocinadores}</div>
                        <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 w-full animate-pulse" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Atletas por Escalão */}
                <Card className="bg-[#1e293b] border-slate-800/50 shadow-xl overflow-hidden">
                    <div className="h-1.5 w-full bg-gradient-to-r from-yellow-400 to-amber-600" />
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-white">Atletas por Escalão</CardTitle>
                        <CardDescription className="text-slate-500">Distribuição por faixas etárias</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {escaloes.map(escalao => {
                                const count = stats.atletasPorEscalao[escalao] || 0;
                                const percentage = maxAtletas > 0 ? (count / maxAtletas) * 100 : 0;
                                return (
                                    <div key={escalao} className="group">
                                        <div className="flex justify-between items-end text-sm mb-2">
                                            <span className="font-bold text-slate-300 group-hover:text-yellow-400 transition-colors capitalize">
                                                {escalao.replace('sub', 'Sub ')}
                                            </span>
                                            <span className="text-slate-100 font-mono bg-slate-800 px-2 py-0.5 rounded text-xs">{count} atletas</span>
                                        </div>
                                        <div className="w-full bg-slate-800/50 rounded-full h-3 p-0.5 border border-slate-700/50">
                                            <div
                                                className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(250,204,21,0.2)]"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Materiais e Viagens */}
                <Card className="bg-[#1e293b] border-slate-800/50 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-white">Operacional & Finanças</CardTitle>
                        <CardDescription className="text-slate-500">Resumo de estado atual</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="group flex justify-between items-center p-5 bg-slate-800/30 rounded-2xl border border-slate-700/30 hover:bg-slate-800/50 transition-all cursor-default">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-300">Materiais Livres</p>
                                        <p className="text-xs text-slate-500">Disponível em armazém</p>
                                    </div>
                                </div>
                                <span className="text-3xl font-black text-emerald-400">{stats.materiaisLivres}</span>
                            </div>

                            <div className="group flex justify-between items-center p-5 bg-slate-800/30 rounded-2xl border border-slate-700/30 hover:bg-slate-800/50 transition-all cursor-default">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-300">Materiais em Uso</p>
                                        <p className="text-xs text-slate-500">Atribuído a atletas</p>
                                    </div>
                                </div>
                                <span className="text-3xl font-black text-blue-400">{stats.materiaisAtribuidos}</span>
                            </div>

                            <div className="group flex justify-between items-center p-5 bg-slate-800/30 rounded-2xl border border-slate-700/30 hover:border-yellow-500/30 hover:bg-yellow-400/[0.02] transition-all cursor-default">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
                                        <Handshake className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-300">Total Patrocínios</p>
                                        <p className="text-xs text-slate-500">Investimento anual</p>
                                    </div>
                                </div>
                                <span className="text-3xl font-black text-yellow-400">€{stats.totalPatrocinios.toFixed(2)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quotas */}
                <Card className="bg-[#1e293b] border-slate-800/50 shadow-xl lg:col-span-2 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold text-white">Relatório de Sócios & Quotas</CardTitle>
                            <CardDescription className="text-slate-500">Estado financeiro das mensalidades</CardDescription>
                        </div>
                        <div className="px-3 py-1 bg-yellow-400 rounded-full text-black text-[10px] font-black uppercase tracking-tighter">Financeiro</div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Quotas Pagas</span>
                                    <span className="text-2xl font-black text-emerald-400">
                                        {stats.quotasPagasMesAtual} / {stats.quotasTotaisMesAtual}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-4 p-1 border border-slate-700/50">
                                    <div
                                        className="bg-emerald-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                                        style={{ width: `${stats.quotasTotaisMesAtual > 0 ? (stats.quotasPagasMesAtual / stats.quotasTotaisMesAtual) * 100 : 0}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">Progresso Mensal</p>
                            </div>

                            <div className="flex flex-col justify-center items-center p-6 bg-slate-800/30 rounded-3xl border border-slate-700/30">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Cobrado (Ano)</p>
                                <span className="text-4xl font-black text-white">
                                    €{stats.quotasCobradasAnoCorrente.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex flex-col justify-center gap-2">
                                {stats.sociosComQuotasEmAtraso > 0 ? (
                                    <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl group hover:bg-red-500/15 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                            <span className="font-black text-red-500 text-lg">
                                                {stats.sociosComQuotasEmAtraso} Em Atraso
                                            </span>
                                        </div>
                                        <p className="text-xs text-red-400/80 mt-1 font-medium">Ações de cobrança necessárias</p>
                                    </div>
                                ) : (
                                    <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl">
                                        <span className="font-black text-emerald-500 text-lg">Regularizado</span>
                                        <p className="text-xs text-emerald-400/80 mt-1 font-medium">Tudo em dia!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PDLManagement;
