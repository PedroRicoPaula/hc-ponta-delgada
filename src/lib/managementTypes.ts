// Types for PDL Management System

export type Escalao = 'sub11' | 'sub13' | 'sub15' | 'sub17' | 'sub19' | 'seniores';

export interface Atleta {
    id: string;
    nome: string;
    numero?: string;
    escalao: Escalao;
    dataNascimento: string;
    telefone: string;
    email: string;
    morada: string;
    // Campos específicos para formação (não-Seniores)
    escola?: string;
    cartaoCidadao?: string;
    nomePai?: string;
    telefonePai?: string;
    nomeMae?: string;
    telefoneMae?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Socio {
    id: string;
    numeroSocio: number; // Auto-incrementado
    nome: string;
    telefone: string;
    email: string;
    morada: string;
    quotaMensal: number;
    quotas: QuotasPorAno; // { "2024": { "1": true, "2": false, ... }, "2025": {...} }
    createdAt: string;
    updatedAt: string;
}

export interface QuotasPorAno {
    [ano: string]: {
        [mes: string]: boolean; // 1-12, true = pago
    };
}

export type MaterialCategoria = 'atleta' | 'guarda-redes' | 'pequeno-material';
export type MaterialTipo =
    | 'stick'
    | 'luvas'
    | 'caneleiras'
    | 'patins'
    | 'capacete'
    | 'cotoveleiras'
    | 'joelheiras'
    | 'bola'
    | 'cones'
    | 'coletes'
    | 'outro';

export type MaterialEstado = 'livre' | 'atribuido' | 'danificado';

export interface Material {
    id: string;
    categoria: MaterialCategoria;
    tipo: MaterialTipo;
    marca?: string;
    tamanho?: string;
    numero?: string;
    estado: MaterialEstado;
    atletaId?: string; // ID do atleta a quem está atribuído
    createdAt: string;
    updatedAt: string;
}

export interface Patrocinador {
    id: string;
    nome: string;
    logotipo?: string; // Base64 encoded PNG/SVG
    website?: string;
    telefone?: string;
    email?: string;
    contribuicao: number; // Em euros
    dataInicio: string;
    dataFim?: string;
    notas?: string;
    createdAt: string;
    updatedAt: string;
}

export type ModoTransporte = 'carrinha-clube' | 'carros-alugados';

export interface Viagem {
    id: string;
    adversario: string;
    pavilhaoUrl?: string;
    dataIda: string;
    dataVolta: string;
    horaPartida: string;
    modoTransporte: ModoTransporte;
    condutores: string[]; // IDs de atletas seniores or membros da direção
    refeicaoLocal?: string;
    refeicaoLink?: string;
    refeicaoHora?: string;
    notas?: string;
    createdAt: string;
    updatedAt: string;
}

export interface MembroDirecao {
    id: string;
    nome: string;
    cargo: string;
    telefone: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

// Dados agregados para o Dashboard
export interface DashboardStats {
    totalAtletas: number;
    totalMateriais: number;
    totalSocios: number;
    totalPatrocinadores: number;
    atletasPorEscalao: Record<Escalao, number>;
    materiaisLivres: number;
    materiaisAtribuidos: number;
    totalPatrocinios: number;
    viagensPlaneadas: number;
    quotasPagasMesAtual: number;
    quotasTotaisMesAtual: number;
    quotasCobradasAnoCorrente: number;
    sociosComQuotasEmAtraso: number;
}
