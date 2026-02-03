import React, { useState } from 'react';
import { TrendingUp, ClipboardList, Edit2, Trash2, Download, FileText, Table as TableIcon } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AttendanceData, AttendanceSession } from '@/lib/treinosFormacaoTypes';
import { toast } from 'sonner';

interface AttendanceSectionProps {
    attendance: AttendanceData;
    updateValuePerSession: (val: number) => void;
    expandedId: string | null;
    setExpandedId: (id: string | null) => void;
    allPlayers: string[];
    formatDate: (date: string) => string;
    onEditSession: (session: AttendanceSession) => void;
    onDeleteSession: (id: string) => void;
}

export const AttendanceSection: React.FC<AttendanceSectionProps> = ({
    attendance,
    updateValuePerSession,
    expandedId,
    setExpandedId,
    allPlayers,
    formatDate,
    onEditSession,
    onDeleteSession
}) => {
    const [inputValue, setInputValue] = useState(attendance.valuePerSession.toString().replace('.', ','));

    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

    const handleValueChange = (val: string) => {
        setInputValue(val);
        const normalized = val.replace(',', '.');
        const num = parseFloat(normalized);
        if (!isNaN(num)) {
            updateValuePerSession(num);
        }
    };

    const getAvailableMonths = () => {
        const months = new Set<string>();
        attendance.sessions.forEach(s => {
            const [year, month] = s.date.split('-');
            months.add(`${year}-${month}`);
        });
        return Array.from(months).sort().reverse();
    };

    const formatMonth = (monthStr: string) => {
        if (monthStr === 'all') return 'Todos os meses';
        const [year, month] = monthStr.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return new Intl.DateTimeFormat('pt-PT', { month: 'long', year: 'numeric' }).format(date);
    };

    const toggleMonth = (month: string) => {
        setSelectedMonths(prev =>
            prev.includes(month)
                ? prev.filter(m => m !== month)
                : [...prev, month]
        );
    };

    const handleExport = () => {
        if (selectedMonths.length === 0) {
            toast.error("Selecione pelo menos um mês");
            return;
        }

        if (exportFormat === 'csv') {
            const allSessions = attendance.sessions.filter(s =>
                selectedMonths.some(month => s.date.startsWith(month))
            );
            exportToCSV(allSessions);
        } else {
            exportToPDF(selectedMonths);
        }
        setIsExportModalOpen(false);
    };

    const exportToCSV = (sessions: AttendanceSession[]) => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Jogador;Presenças;%;Total (P)\n";

        allPlayers.forEach(player => {
            const presences = sessions.filter(s => s.presentPlayers.includes(player)).length;
            const percentage = sessions.length > 0 ? Math.round((presences / sessions.length) * 100) : 0;
            const totalValue = presences * attendance.valuePerSession;
            csvContent += `${player};${presences};${percentage}%;${totalValue.toFixed(2).replace('.', ',')}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        const filename = selectedMonths.length === 1 ? `assiduidade_${selectedMonths[0]}` : 'assiduidade_selecionada';
        link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("CSV exportado com sucesso");
    };

    const exportToPDF = (months: string[]) => {
        const printContainer = document.createElement('div');
        printContainer.id = 'print-document';
        printContainer.className = 'fixed inset-0 bg-white z-[9999] p-0 hidden print:block';

        const sortedMonths = [...months].sort();

        let html = `
            <style>
                @page {
                    size: A4;
                    margin: 10mm;
                }
                @media print {
                    body * { visibility: hidden; }
                    #print-document, #print-document * { visibility: visible; }
                    #print-document { 
                        position: absolute; 
                        left: 0; 
                        top: 0; 
                        width: 100%;
                        visibility: visible;
                    }
                }
                .pdf-page {
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    color: #1e293b;
                    width: 100%;
                    box-sizing: border-box;
                    page-break-after: always;
                    break-after: page;
                }
                .pdf-page:last-child {
                    page-break-after: auto;
                    break-after: auto;
                }
                .pdf-header {
                    text-align: center;
                    margin-bottom: 20px;
                    border-bottom: 1.5px solid #e2e8f0;
                    padding-bottom: 12px;
                }
                .pdf-stats-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-bottom: 20px;
                    background: #f8fafc;
                    padding: 12px;
                    border-radius: 6px;
                }
                .pdf-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 11px;
                }
                .pdf-table th {
                    background-color: #f1f5f9;
                    padding: 8px 10px;
                    text-align: left;
                    border: 0.5px solid #cbd5e1;
                    color: #475569;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .pdf-table td {
                    padding: 6px 10px;
                    border: 0.5px solid #e2e8f0;
                }
            </style>
        `;

        sortedMonths.forEach((month, index) => {
            const sessions = attendance.sessions.filter(s => s.date.startsWith(month));
            const monthTitle = formatMonth(month);

            html += `
                <div class="pdf-page">
                    <div class="pdf-header">
                        <h1 style="margin: 0; font-size: 18px; color: #0f172a;">Relatório de Assiduidade - Seniores</h1>
                        <p style="margin: 2px 0; font-size: 12px; color: #64748b; font-weight: 600;">Hóquei Clube Ponta Delgada</p>
                        <p style="margin: 2px 0; font-size: 11px; color: #94a3b8;">Referência: ${monthTitle}</p>
                    </div>
                    
                    <div class="pdf-stats-grid">
                        <div style="text-align: center;">
                            <span style="display: block; font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: bold;">Treinos no Mês</span>
                            <span style="font-size: 16px; font-weight: 800; color: #0f172a;">${sessions.length}</span>
                        </div>
                        <div style="text-align: center;">
                            <span style="display: block; font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: bold;">Valor p/ Treino</span>
                            <span style="font-size: 16px; font-weight: 800; color: #166534;">${attendance.valuePerSession.toFixed(2).replace('.', ',')}P</span>
                        </div>
                    </div>

                    <table class="pdf-table">
                        <thead>
                            <tr>
                                <th style="width: 40%;">JOGADOR</th>
                                <th style="text-align: center;">PRESENÇAS</th>
                                <th style="text-align: center;">% MÊS</th>
                                <th style="text-align: right;">TOTAL MÊS</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            allPlayers.forEach(player => {
                const presences = sessions.filter(s => s.presentPlayers.includes(player)).length;
                const percentage = sessions.length > 0 ? Math.round((presences / sessions.length) * 100) : 0;
                const totalValue = presences * attendance.valuePerSession;
                html += `
                    <tr>
                        <td style="font-weight: 600;">${player}</td>
                        <td style="text-align: center; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">${presences}</td>
                        <td style="text-align: center;">${percentage}%</td>
                        <td style="text-align: right; font-weight: 700; color: #166534;">${totalValue.toFixed(2).replace('.', ',')}P</td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                    <div style="margin-top: 20px; font-size: 9px; color: #94a3b8; text-align: center; border-top: 1px dashed #e2e8f0; padding-top: 10px;">
                        Página ${index + 1} de ${sortedMonths.length} - Gerado em ${new Date().toLocaleDateString('pt-PT')} às ${new Date().toLocaleTimeString('pt-PT')}
                    </div>
                </div>
            `;
        });

        printContainer.innerHTML = html;
        document.body.appendChild(printContainer);

        window.print();

        setTimeout(() => {
            document.body.removeChild(printContainer);
        }, 1000);

        toast.info("A otimizar layout para A4. Verifique a pré-visualização.");
    };

    return (
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
                        <div className="w-5 h-5 mx-auto mb-2 text-green-600 flex items-center justify-center font-bold text-lg">P</div>
                        <div className="flex items-center justify-center gap-1">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => handleValueChange(e.target.value)}
                                className="w-16 bg-transparent text-center border-b border-dashed border-gray-300 focus:outline-none focus:border-primary font-bold text-2xl"
                            />
                            <span className="font-bold text-2xl">P</span>
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
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <Button onClick={() => setIsExportModalOpen(true)} variant="outline" size="sm" className="flex gap-2">
                            <Download className="w-4 h-4" /> Exportar Dados
                        </Button>
                    </div>

                    <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Exportar Estatísticas</DialogTitle>
                                <DialogDescription>
                                    Selecione o período e o formato de exportação desejado.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium">Meses para Exportar</label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-[10px] uppercase font-bold text-primary"
                                            onClick={() => {
                                                const allMonths = getAvailableMonths();
                                                setSelectedMonths(selectedMonths.length === allMonths.length ? [] : allMonths);
                                            }}
                                        >
                                            {selectedMonths.length === getAvailableMonths().length ? 'Desmarcar Todos' : 'Marcar Todos'}
                                        </Button>
                                    </div>
                                    <div className="max-h-[150px] overflow-y-auto border rounded-md p-2 space-y-1 bg-gray-50">
                                        {getAvailableMonths().length === 0 ? (
                                            <p className="text-xs text-center text-gray-400 py-4">Sem meses com registos</p>
                                        ) : (
                                            getAvailableMonths().map(month => (
                                                <div
                                                    key={month}
                                                    onClick={() => toggleMonth(month)}
                                                    className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-all ${selectedMonths.includes(month) ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-white text-gray-600'}`}
                                                >
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedMonths.includes(month) ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                                                        {selectedMonths.includes(month) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                    </div>
                                                    <span className="text-xs">{formatMonth(month)}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Formato do Ficheiro</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant={exportFormat === 'csv' ? 'default' : 'outline'}
                                            onClick={() => setExportFormat('csv')}
                                            className="flex gap-2"
                                        >
                                            <TableIcon className="w-4 h-4" /> CSV (Excel)
                                        </Button>
                                        <Button
                                            variant={exportFormat === 'pdf' ? 'default' : 'outline'}
                                            onClick={() => setExportFormat('pdf')}
                                            className="flex gap-2"
                                        >
                                            <FileText className="w-4 h-4" /> PDF (Imprimir)
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsExportModalOpen(false)}>Cancelar</Button>
                                <Button onClick={handleExport}>Descarregar</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
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
                                {allPlayers.map(player => {
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
                                            <td className="px-4 py-3 text-sm font-bold text-right text-green-600">{totalValue.toFixed(2).replace('.', ',')}P</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
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
                                    <div className="text-xs text-gray-500">{session.presentPlayers.length} presentes / {allPlayers.length} total</div>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => onEditSession(session)} className="h-8 w-8">
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => onDeleteSession(session.id)} className="h-8 w-8 text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
