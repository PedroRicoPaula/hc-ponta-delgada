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
  opponent: string;
  isHome: boolean;
  date: string; // DD/MM/YYYY
  time: string; // HH:mm
  location: string;
  competition: string;
  youtubeUrl?: string; // só jogos em casa têm transmissão
  result?: { home: number; away: number };
}

export function parseGameDateTime(game: Pick<Game, 'date' | 'time'>): Date {
  const [day, month, year] = game.date.split('/').map(Number);
  const [hour, minute] = game.time.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute);
}

const YOUTUBE_LIVE_URL = 'https://www.youtube.com/@HoqueiClubePDL/live';
const PAVILHAO_PDL = 'Pavilhão Sidónio Serpa';

const COMPETITION = "Campeonato Nacional da 3ª Divisão — Série Sul B";

// Adversários reais da série (fonte: https://hp.fpp.pt/Classificacao/414, verificado 2026-07-16).
// Datas ancoradas para a época "começar ontem" a pedido — jogo 1 é sempre D-1 relativo a hoje.
export const games: Game[] = [
  { id: "jogo-2026-07-15", opponent: "HCP Grândola", isHome: true, date: "15/07/2026", time: "19:00", location: PAVILHAO_PDL, competition: COMPETITION, youtubeUrl: YOUTUBE_LIVE_URL, result: { home: 6, away: 4 } },
  { id: "jogo-2026-07-16", opponent: "HC Vasco da Gama/J.Ascenção", isHome: true, date: "16/07/2026", time: "19:30", location: PAVILHAO_PDL, competition: COMPETITION, youtubeUrl: YOUTUBE_LIVE_URL },
  { id: "jogo-2026-07-17", opponent: "GDS Cascais", isHome: false, date: "17/07/2026", time: "18:00", location: "Pavilhão Municipal de Cascais", competition: COMPETITION },
  { id: "jogo-2026-07-18", opponent: "F.Salesianos/AJ Salesiana", isHome: true, date: "18/07/2026", time: "19:00", location: PAVILHAO_PDL, competition: COMPETITION, youtubeUrl: YOUTUBE_LIVE_URL },
  { id: "jogo-2026-07-19", opponent: "HC Sintra/Planta Livre", isHome: false, date: "19/07/2026", time: "15:30", location: "Pavilhão Municipal de Sintra", competition: COMPETITION },
  { id: "jogo-2026-07-20", opponent: "CD Paço de Arcos \"B\"", isHome: true, date: "20/07/2026", time: "20:00", location: PAVILHAO_PDL, competition: COMPETITION, youtubeUrl: YOUTUBE_LIVE_URL },
  { id: "jogo-2026-07-21", opponent: "GD Sesimbra", isHome: false, date: "21/07/2026", time: "16:00", location: "Pavilhão Municipal de Sesimbra", competition: COMPETITION },
  { id: "jogo-2026-07-22", opponent: "A Stuart HC Massamá", isHome: true, date: "22/07/2026", time: "19:30", location: PAVILHAO_PDL, competition: COMPETITION, youtubeUrl: YOUTUBE_LIVE_URL },
  { id: "jogo-2026-07-23", opponent: "HC Santiago", isHome: false, date: "23/07/2026", time: "17:00", location: "Pavilhão Municipal de Santiago do Cacém", competition: COMPETITION },
  { id: "jogo-2026-07-24", opponent: "CD Boliqueime", isHome: true, date: "24/07/2026", time: "20:00", location: PAVILHAO_PDL, competition: COMPETITION, youtubeUrl: YOUTUBE_LIVE_URL },
  { id: "jogo-2026-07-25", opponent: "UDC Nafarros", isHome: false, date: "25/07/2026", time: "15:00", location: "Pavilhão de Nafarros, Sintra", competition: COMPETITION },
  { id: "jogo-2026-07-26", opponent: "Juventude Azeitonense", isHome: true, date: "26/07/2026", time: "19:00", location: PAVILHAO_PDL, competition: COMPETITION, youtubeUrl: YOUTUBE_LIVE_URL },
  { id: "jogo-2026-07-27", opponent: "CP Beja", isHome: false, date: "27/07/2026", time: "16:30", location: "Pavilhão Municipal de Beja", competition: COMPETITION },
  { id: "jogo-2026-07-28", opponent: "HCP Grândola", isHome: false, date: "28/07/2026", time: "15:30", location: "Pavilhão Municipal de Grândola", competition: COMPETITION },
  { id: "jogo-2026-07-29", opponent: "GDS Cascais", isHome: true, date: "29/07/2026", time: "20:00", location: PAVILHAO_PDL, competition: COMPETITION, youtubeUrl: YOUTUBE_LIVE_URL },
  { id: "jogo-2026-07-30", opponent: "HC Vasco da Gama/J.Ascenção", isHome: false, date: "30/07/2026", time: "16:00", location: "Pavilhão do Vasco da Gama, Lisboa", competition: COMPETITION },
  { id: "jogo-2026-07-31", opponent: "HC Sintra/Planta Livre", isHome: true, date: "31/07/2026", time: "19:30", location: PAVILHAO_PDL, competition: COMPETITION, youtubeUrl: YOUTUBE_LIVE_URL },
  { id: "jogo-2026-08-01", opponent: "F.Salesianos/AJ Salesiana", isHome: false, date: "01/08/2026", time: "15:00", location: "Pavilhão dos Salesianos, Setúbal", competition: COMPETITION },
  { id: "jogo-2026-08-02", opponent: "GD Sesimbra", isHome: true, date: "02/08/2026", time: "19:00", location: PAVILHAO_PDL, competition: COMPETITION, youtubeUrl: YOUTUBE_LIVE_URL },
  { id: "jogo-2026-08-03", opponent: "CD Paço de Arcos \"B\"", isHome: false, date: "03/08/2026", time: "16:00", location: "Pavilhão Municipal de Paço de Arcos", competition: COMPETITION },
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
}

// Logos antigos não usados aqui (Auto Cordeiro, Crenku, Agência Funerária Lindo) continuam
// em public/uploads/patrocinadores/ — mantidos de propósito, podem voltar a ser precisos.
export const sponsors: Sponsor[] = [
  { name: "Agri Tractores", logo: "/uploads/patrocinadores/agritatores_logo.png", url: "https://agritractores.pt/", featured: true },
  { name: "Azemad", logo: "/uploads/patrocinadores/AzemadLogo.jpg", url: "https://azemad.com/" },
  { name: "Catchawards", logo: "/uploads/patrocinadores/catchawards.png", url: "https://www.catchawardsportugal.pt/" },
  { name: "Junta de Freguesia de Santa Clara", logo: "/uploads/patrocinadores/logo_JFSantaClara.png", url: "https://www.freguesiadesantaclara.com/" },
  { name: "Câmara Municipal de Ponta Delgada", logo: "/uploads/patrocinadores/logotipo_pontadelgadaV2.svg", url: "https://www.cm-pontadelgada.pt/" },
  { name: "Pérola da Ilha", logo: "/uploads/patrocinadores/logo_peroladailha.jpeg", url: "https://www.peroladailha.pt/" },
  { name: "AFISA", logo: "/uploads/patrocinadores/logo_afisa.png", url: "https://www.facebook.com/p/AFISA-100083180627789/" },
  { name: "Lene Car", logo: "/uploads/patrocinadores/logo_lenecar.webp", url: "https://www.lenecarautomoveis.com/" },
];