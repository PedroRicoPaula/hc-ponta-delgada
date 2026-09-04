// src/data/siteData.ts

export interface PlayerStats {
  games: number;
  goals: number;
  assists: number;
  age: number;
  nationality: string;
  penaltySaves?: number;  // só guarda-redes — penáltis defendidos
  freeHitSaves?: number;  // só guarda-redes — livres diretos defendidos
}

export interface Player {
  number: number;
  name: string;
  position: string;
  photo?: string;
  stats: PlayerStats;
}

export const players: Player[] = [
  { number: 1,  name: "Nuno Teixeira",      position: "Guarda-Redes", stats: { games: 18, goals: 0, assists: 0, age: 29, nationality: "PT", penaltySaves: 5, freeHitSaves: 9 } },
  { number: 16, name: "Simão Loureiro",     position: "Guarda-Redes", photo: "/uploads/jogadores/simaoloureiro.jpeg",    stats: { games: 6,  goals: 0, assists: 0, age: 22, nationality: "PT", penaltySaves: 1, freeHitSaves: 3 } },
  { number: 3,  name: "Tiago Pimentel",     position: "Defesa",       photo: "/uploads/jogadores/tiagopimentel.jpeg",    stats: { games: 20, goals: 2, assists: 4, age: 27, nationality: "PT" } },
  { number: 8,  name: "Marco Resendes",     position: "Defesa",       photo: "/uploads/jogadores/marcoresendes.jpeg",    stats: { games: 17, goals: 1, assists: 3, age: 25, nationality: "PT" } },
  { number: 7,  name: "Alexandre Resendes", position: "Médio",        photo: "/uploads/jogadores/alexandreresendes.jpeg",stats: { games: 22, goals: 5, assists: 7, age: 24, nationality: "PT" } },
  { number: 11, name: "Alexandre Ornelas",  position: "Médio",        photo: "/uploads/jogadores/alexandreornelas.jpeg", stats: { games: 19, goals: 4, assists: 6, age: 23, nationality: "PT" } },
  { number: 4,  name: "Tiago Leite",        position: "Avançado",     photo: "/uploads/jogadores/tiagoleite.jpeg",       stats: { games: 15, goals: 2, assists: 4, age: 24, nationality: "PT" } },
  { number: 6,  name: "Miguel Pimentel",    position: "Avançado",     photo: "/uploads/jogadores/miguelpimentel.jpeg",   stats: { games: 21, goals: 12, assists: 5, age: 26, nationality: "PT" } },
  { number: 10, name: "Carlos Guimarães",   position: "Avançado",     photo: "/uploads/jogadores/carlosguimaraes.jpeg",  stats: { games: 20, goals: 9, assists: 8, age: 34, nationality: "PT" } },
  { number: 9,  name: "Pedro Paula",        position: "Universal",    photo: "/uploads/jogadores/pedropaula.jpeg",       stats: { games: 22, goals: 7, assists: 11, age: 28, nationality: "PT" } },
  { number: 14, name: "Francisco Freitas",  position: "Universal",    stats: { games: 15, goals: 3, assists: 5, age: 21, nationality: "PT" } },
  { number: 17, name: "Vicente Correia",    position: "Universal",    photo: "/uploads/jogadores/vicente.jpeg",          stats: { games: 18, goals: 6, assists: 9, age: 23, nationality: "PT" } },
];

export const playersByPosition = {
  "Guarda-Redes": ["Nuno Teixeira", "Simão Loureiro"],
  "Defesa": ["Tiago Pimentel", "Marco Resendes"],
  "Médio": ["Alexandre Resendes", "Alexandre Ornelas"],
  "Avançado": ["Miguel Pimentel", "Carlos Guimarães"],
  "Universal": ["Pedro Paula", "Francisco Freitas", "Vicente Correia"]
};

export const staff = [
  { name: "Carlos Guimarães", role: "Treinador" },
  { name: "João Oliveira", role: "Diretor" },
  { name: "Paulo Benjamim", role: "Diretor" },
  { name: "Fernando Pimentel", role: "Diretor" },
  { name: "Paulo Correia", role: "Preparador Físico" }
];

export const senioresEvents = [
  {
    id: "seniores-1",
    title: "Hóquei Clube PDL vs CD Boliqueime",
    date: "23/05/2026",
    time: "18:30",
    location: "Pavilhão Sidónio Serpa",
    type: "Seniores",
  }
];

export const formacaoEvents = [
  {
    id: "formacao-1",
    title: "Caldeiras HC vs Hóquei Clube PDL",
    date: "06/06/2026",
    time: "14:30",
    location: "Complexo Desportivo Ribeira Grande",
    type: "Sub 13",
  },
  {
    id: "formacao-2",
    title: "Hóquei Clube PDL vs Caldeiras HC",
    date: "07/06/2026",
    time: "11:00",
    location: "Pavilhão Sidónio Serpa",
    type: "Sub 17",
  },
  {
    id: "formacao-3",
    title: "Hóquei Clube PDL vs Caldeiras HC",
    date: "10/06/2026",
    time: "11:00",
    location: "Pavilhão Sidónio Serpa",
    type: "Sub 11",
  },
  {
    id: "formacao-4",
    title: "Hóquei Clube PDL vs Zona Sul 4º Classificado",
    date: "12/06/2026",
    time: "18:30",
    location: "Pavilhão Municipal de Valongo",
    type: "Sub 13",
  },
  {
    id: "formacao-5",
    title: "Zona  Norte 4º Classificado vs Hóquei Clube PDL",
    date: "13/06/2026",
    time: "14:00",
    location: "Pavilhão Municipal de Valongo",
    type: "Sub 13",
  },
  {
    id: "formacao-6",
    title: "AP Madeira vs Hóquei Clube PDL",
    date: "14/06/2026",
    time: "11:30",
    location: "Pavilhão Municipal de Valongo",
    type: "Sub 13",
  },
];

export interface Game {
  id: string;
  jornada: number;
  opponent: string;
  isHome: boolean;
  date: string; // DD/MM/YYYY
  /**
   * HH:mm. Opcional só enquanto a FPP não publicar a hora — usar `formatGameTime()`
   * na UI, nunca ler este campo directamente.
   */
  time?: string;
  location: string;
  competition: string;
  /** Transmissão no site. Casa: URL do canal. Fora: omitir, ou meter o live do adversário (`watch?v=` ou `/channel/UC…/live`). */
  youtubeUrl?: string;
  result?: { home: number; away: number };
}

export const TIME_TBD_LABEL = 'Horário a definir';

/**
 * Sem hora marcada assume-se meia-noite, só para o jogo ter uma posição estável
 * na ordenação e no calendário. Não usar este valor para mostrar horas — ver
 * `formatGameTime()` — nem para decidir se um jogo está a decorrer, senão um
 * jogo sem hora aparecia "em direto" à meia-noite (ver getGameStatus).
 */
export function parseGameDateTime(game: Pick<Game, 'date' | 'time'>): Date {
  const [day, month, year] = game.date.split('/').map(Number);
  const [hour, minute] = (game.time ?? '00:00').split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute);
}

export function hasKnownTime(game: Pick<Game, 'time'>): boolean {
  return Boolean(game.time);
}

export function formatGameTime(game: Pick<Game, 'time'>): string {
  return game.time ?? TIME_TBD_LABEL;
}

/**
 * Nomes do confronto pela ordem real: equipa da casa à esquerda, visitante à
 * direita. Mostrar sempre "HC PDL" à esquerda escondia se o jogo era em casa ou
 * fora, e desalinhava o resultado — o placar é gravado como `result.home` /
 * `result.away` (equipas reais), por isso num jogo fora o número da esquerda é
 * do adversário enquanto o nome da esquerda dizia HC PDL.
 */
export function getMatchupNames(
  game: Pick<Game, 'isHome' | 'opponent'>,
  pdlLabel = 'HC PDL',
): { home: string; away: string } {
  return game.isHome
    ? { home: pdlLabel, away: game.opponent }
    : { home: game.opponent, away: pdlLabel };
}

const YOUTUBE_LIVE_URL = 'https://www.youtube.com/@HoqueiClubePDL/live';
const PAVILHAO_PDL = 'Pavilhão Sidónio Serpa';

const COMPETITION = "Campeonato Nacional da 3ª Divisão — Série Sul B";

/**
 * Recintos dos adversários. Definidos uma vez e referenciados nos dois jogos
 * (ida e volta) para não poderem divergir.
 *
 * Formas curtas do nome oficial — o cartão do calendário mostra isto numa
 * linha de `text-xs` e nomes muito longos partem em três linhas no telemóvel.
 * Ex.: "Pavilhão Gimnodesportivo de Paço de Arcos" → "Pavilhão de Paço de Arcos".
 */
const PAV = {
  boliqueime: 'Pavilhão Municipal de Boliqueime',
  pacoArcos: 'Pavilhão de Paço de Arcos',
  sintra: 'Pavilhão de Monte Santos',
  vascoGama: 'Pavilhão Municipal de Sines',
  aeFisica: 'Pavilhão da AE Física, Torres Vedras',
  massama: 'Pavilhão Prof. João Campelo',
  sesimbra: 'Pavilhão de Sesimbra',
  cascais: 'Pavilhão Guilherme Pinto Basto',
  azeitonense: 'Pavilhão de Santa Sofia',
  vilafranquense: 'Pavilhão da UD Vilafranquense',
  santiago: 'Pavilhão de Santiago do Cacém',
  corujas: 'Pavilhão Municipal de Coruche',
  alenquer: 'Pavilhão Municipal de Alenquer',
} as const;

// Calendário oficial 2026/27, CN 3ª Divisão Sul B.
// Fonte: https://hp.fpp.pt/Competicao/501 — extraído 2026-08-11; horas actualizadas 2026-09.
// 26 jornadas, 13 em casa e 13 fora, 14 equipas na série (sem bye).
// Pavilhões dos jogos fora: nomes curtos em `PAV` (ver comentário acima).
export const games: Game[] = [
  { id: "jornada-1", jornada: 1, opponent: "HC Vasco da Gama/J.Ascenção", isHome: true, date: "25/10/2026", time:"15:00", location: PAVILHAO_PDL, competition: COMPETITION, youtubeUrl: YOUTUBE_LIVE_URL },
  { id: "jornada-2", jornada: 2, opponent: "CD Boliqueime", isHome: false, date: "31/10/2026", time: "19:00", location: PAV.boliqueime, competition: COMPETITION },
  { id: "jornada-3", jornada: 3, opponent: "HC Sintra / Planta Livre", isHome: true, date: "08/11/2026", time:"16:00", location: PAVILHAO_PDL, competition: COMPETITION, youtubeUrl: YOUTUBE_LIVE_URL },
  { id: "jornada-4", jornada: 4, opponent: "AE Física D \"B\"", isHome: false, date: "15/11/2026", time:"16:00", location: PAV.aeFisica, competition: COMPETITION },
  { id: "jornada-5", jornada: 5, opponent: "CD Paço de Arcos \"B\"", isHome: false, date: "22/11/2026", time:"16:00", location: PAV.pacoArcos, competition: COMPETITION },
  { id: "jornada-6", jornada: 6, opponent: "A Stuart HC Massamá", isHome: true, date: "06/12/2026", time:"16:00", location: PAVILHAO_PDL, competition: COMPETITION, youtubeUrl: YOUTUBE_LIVE_URL },
  { id: "jornada-7", jornada: 7, opponent: "GD Sesimbra", isHome: false, date: "08/12/2026", time:"16:00", location: PAV.sesimbra, competition: COMPETITION },
  { id: "jornada-8", jornada: 8, opponent: "GDS Cascais", isHome: true, date: "13/12/2026", time:"16:00", location: PAVILHAO_PDL, competition: COMPETITION, youtubeUrl: YOUTUBE_LIVE_URL },
  { id: "jornada-9", jornada: 9, opponent: "J. Azeitonense", isHome: false, date: "10/01/2027", time:"16:00", location: PAV.azeitonense, competition: COMPETITION },
  { id: "jornada-10", jornada: 10, opponent: "UD Vilafranquense", isHome: true, date: "24/01/2027", time:"16:00", location: PAVILHAO_PDL, competition: COMPETITION, youtubeUrl: YOUTUBE_LIVE_URL },
  { id: "jornada-11", jornada: 11, opponent: "HC Santiago", isHome: false, date: "31/01/2027", time: "16:00", location: PAV.santiago, competition: COMPETITION },
  { id: "jornada-12", jornada: 12, opponent: "GCC \"Os Corujas\"", isHome: true, date: "07/02/2027", time:"16:00", location: PAVILHAO_PDL, competition: COMPETITION, youtubeUrl: YOUTUBE_LIVE_URL },
  { id: "jornada-13", jornada: 13, opponent: "S Alenquer B \"B\"", isHome: false, date: "09/02/2027", time:"14:30", location: PAV.alenquer, competition: COMPETITION },
  { id: "jornada-14", jornada: 14, opponent: "HC Vasco da Gama/J.Ascenção", isHome: false, date: "21/02/2027", time:"18:00", location: PAV.vascoGama, competition: COMPETITION },
  { id: "jornada-15", jornada: 15, opponent: "CD Boliqueime", isHome: true, date: "28/02/2027", time:"16:00", location: PAVILHAO_PDL, competition: COMPETITION, youtubeUrl: YOUTUBE_LIVE_URL },
  { id: "jornada-16", jornada: 16, opponent: "HC Sintra / Planta Livre", isHome: false, date: "07/03/2027", time:"16:00", location: PAV.sintra, competition: COMPETITION },
  { id: "jornada-17", jornada: 17, opponent: "AE Física D \"B\"", isHome: true, date: "21/03/2027", time:"16:00", location: PAVILHAO_PDL, competition: COMPETITION, youtubeUrl: YOUTUBE_LIVE_URL },
  { id: "jornada-18", jornada: 18, opponent: "CD Paço de Arcos \"B\"", isHome: true, date: "26/03/2027", time:"15:00", location: PAVILHAO_PDL, competition: COMPETITION, youtubeUrl: YOUTUBE_LIVE_URL },
  { id: "jornada-19", jornada: 19, opponent: "A Stuart HC Massamá", isHome: false, date: "04/04/2027", time:"16:00", location: PAV.massama, competition: COMPETITION },
  { id: "jornada-20", jornada: 20, opponent: "GD Sesimbra", isHome: true, date: "11/04/2027", time:"16:00", location: PAVILHAO_PDL, competition: COMPETITION, youtubeUrl: YOUTUBE_LIVE_URL },
  { id: "jornada-21", jornada: 21, opponent: "GDS Cascais", isHome: false, date: "18/04/2027", time:"16:00", location: PAV.cascais, competition: COMPETITION },
  { id: "jornada-22", jornada: 22, opponent: "J. Azeitonense", isHome: true, date: "25/04/2027", time:"16:00", location: PAVILHAO_PDL, competition: COMPETITION, youtubeUrl: YOUTUBE_LIVE_URL },
  { id: "jornada-23", jornada: 23, opponent: "UD Vilafranquense", isHome: false, date: "09/05/2027", time:"16:00", location: PAV.vilafranquense, competition: COMPETITION },
  { id: "jornada-24", jornada: 24, opponent: "HC Santiago", isHome: true, date: "16/05/2027", time:"16:00", location: PAVILHAO_PDL, competition: COMPETITION, youtubeUrl: YOUTUBE_LIVE_URL },
  { id: "jornada-25", jornada: 25, opponent: "GCC \"Os Corujas\"", isHome: false, date: "23/05/2027", time:"16:00", location: PAV.corujas, competition: COMPETITION },
  { id: "jornada-26", jornada: 26, opponent: "S Alenquer B \"B\"", isHome: true, date: "30/05/2027", time: "18:00", location: PAVILHAO_PDL, competition: COMPETITION, youtubeUrl: YOUTUBE_LIVE_URL },
];

export interface Comunicado {
  id: number;
  slug: string;
  titulo: string;
  data: string;
  conteudo: string;
  pdfUrl?: string;
}

export const comunicados: Comunicado[] = [
  {
    id: 5,
    slug: "eleicoes-orgaos-sociais-2026-2028",
    titulo: "Comunicado – Eleições dos Órgãos Sociais 2026/2028",
    data: "20/03/2026",
    conteudo: `O Hóquei Clube PDL informa que está aberto o processo de apresentação de candidaturas para a eleição dos Órgãos Sociais relativos ao biénio 2026/2028.

As listas candidatas devem incluir um número ímpar de elementos (3 ou 5) para cada órgão: Assembleia Geral, Direção e Conselho Fiscal, conforme os estatutos do clube.

O prazo para submissão das candidaturas decorre até 24 de abril de 2026. Após validação, as listas e respetivos projetos serão divulgados no site oficial até 30 de abril de 2026.

A eleição terá lugar no dia 7 de maio de 2026, em Assembleia Geral, sendo a tomada de posse realizada imediatamente após.

As candidaturas devem ser enviadas por via digital para o email do clube.`,
    pdfUrl: "/uploads/Comunicado Eleições OS.pdf"
  },
  {
    id: 1,
    slug: "vencedores-sub-13-marco-2026",
    titulo: "VENCEDORES Sub-13",
    data: "01/03/2026",
    conteudo:
      "O escalão de formação Sub-13 do Hóquei Clube PDL sagraram-se Campeões Regionais...",
  },
  {
    id: 2,
    slug: "vencedores-sub-17-marco-2026",
    titulo: "VENCEDORES Sub-17",
    data: "01/03/2026",
    conteudo:
      "O escalão de formação Sub-17 do Hóquei Clube PDL sagraram-se vencedores do Campeonato de São Miguel...",
  },
  {
    id: 3,
    slug: "vencedores-sub-13-fevereiro-2026",
    titulo: "VENCEDORES Sub-13",
    data: "15/02/2026",
    conteudo:
      "O escalão de formação Sub-13 do Hóquei Clube PDL sagraram-se vencedores do Campeonato de São Miguel...",
  },
  {
    id: 4,
    slug: "vencedores-sub-13-sub-17-torneio-cidade-ribeira-grande",
    titulo: "VENCEDORES Sub-13 e Sub-17",
    data: "28/09/2025",
    conteudo:
      "Os escalões de formação Sub-13 e Sub-17 do Hóquei Clube PDL sagraram-se vencedores do Torneio Cidade da Ribeira Grande...",
  }
];

export function getComunicado(slug: string): Comunicado | undefined {
  return comunicados.find(c => c.slug === slug);
}

export function parseComunicadoDate(data: string): Date {
  const [day, month, year] = data.split('/').map(Number);
  return new Date(year, month - 1, day);
}

export function getRecentComunicados(count = 3): Comunicado[] {
  return [...comunicados]
    .sort((a, b) => parseComunicadoDate(b.data).getTime() - parseComunicadoDate(a.data).getTime())
    .slice(0, count);
}

export const galleryImages = [
  "/uploads/interregioes2425.png",
  "/uploads/youtube.png",
  "/uploads/halloween2425.png",
  "/uploads/natal2425.png",
  "/uploads/pascoa2425.png",
  "/uploads/campeonatoregionalsub132425.png",
  "/uploads/campeonatoregionalsub152425.png",
  "/uploads/treinospdl2526.png",
  "/uploads/TorneioCidadeRG_PDL_Campeao_Sub13_Sub17.jpeg",
  "/uploads/CampeonatoSM_sub13_2025_26.jpeg"
];

export const trainingSchedules = [
  {
    type: "Sub 11",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    sessions: [
      { day: "Terça", time: "19:00 - 20:30" },
      { day: "Sexta", time: "18:00 - 19:00" }
    ]
  },
  {
    type: "Sub 13",
    color: "bg-green-100 text-green-700 border-green-200",
    sessions: [
      { day: "Segunda", time: "19:00 - 20:00" },
      { day: "Quarta", time: "18:30 - 19:30" },
      { day: "Sexta", time: "19:00 - 20:30" }
    ]
  },
  {
    type: "Sub 17",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    sessions: [
      { day: "Segunda", time: "20:00 - 21:30" },
      { day: "Quarta", time: "19:30 - 21:00" },
      { day: "Sexta", time: "20:30 - 22:00" }
    ]
  }
];

export interface Sponsor {
  name: string;
  logo: string;
  url?: string;
  featured?: boolean;
  /** Light baked-in background — white plate in dark mode, no brightness boost. */
  lightPlate?: boolean;
}

// Logos antigos não usados aqui (Auto Cordeiro, Crenku, Agência Funerária Lindo, Azemad)
// continuam em public/uploads/patrocinadores/ — mantidos de propósito, podem voltar a ser precisos.
export const sponsors: Sponsor[] = [
  { name: "Agri Tractores", logo: "/uploads/patrocinadores/agritatores_logo.png", url: "https://agritractores.pt/", featured: true },
  { name: "Catchawards", logo: "/uploads/patrocinadores/catchawards.png", url: "https://www.catchawardsportugal.pt/" },
  { name: "Junta de Freguesia de Santa Clara", logo: "/uploads/patrocinadores/logo_JFSantaClara.png", url: "https://www.freguesiadesantaclara.com/" },
  { name: "Junta de Freguesia de São José", logo: "/uploads/patrocinadores/freguesiasaojose.jpeg", url: "https://juntafreguesiasaojose.pt/", lightPlate: true },
  { name: "Câmara Municipal de Ponta Delgada", logo: "/uploads/patrocinadores/logotipo_pontadelgadaV2.svg", url: "https://www.cm-pontadelgada.pt/" },
  { name: "Pérola da Ilha", logo: "/uploads/patrocinadores/logo_peroladailha.jpeg", url: "https://www.peroladailha.pt/" },
  { name: "AFISA", logo: "/uploads/patrocinadores/logo_afisa.png", url: "https://www.facebook.com/p/AFISA-100083180627789/" },
  { name: "Lene Car", logo: "/uploads/patrocinadores/logo_lenecar.webp", url: "https://www.lenecarautomoveis.com/" },
  { name: "PMA Açores", logo: "/uploads/patrocinadores/pma-acores.jpeg", url: "https://www.pmasolutions.com/" },
  { name: "Residência Segura", logo: "/uploads/patrocinadores/residencia-segura.jpeg", url: "https://www.residenciasegura.pt/", lightPlate: true },
  { name: "Talento", logo: "/uploads/patrocinadores/talento.jpeg", url: "https://centrostalento.pt/", lightPlate: true },
  { name: "iServices", logo: "/uploads/patrocinadores/iservices.jpeg", url: "https://iservices.pt/", lightPlate: true },
  { name: "Almério e Cordeiro", logo: "/uploads/patrocinadores/almerioecordeiro.jpeg", url: "https://almeriocordeiro.pt/", lightPlate: true },
  { name: "Governo dos Açores", logo: "/uploads/patrocinadores/governoacores.jpeg", url: "https://portal.azores.gov.pt/", lightPlate: true },
];