// src/data/siteData.ts

export const playersByPosition = {
  "Guarda-Redes": ["Nuno Teixeira", "Simão Loureiro"],
  "Defesa": ["Tiago Pimentel"],
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
    title: "Hóquei Clube PDL vs AJ Salesiana",
    date: "21/03/2026",
    time: "15:00",
    location: "Pavilhão Sidónio Serpa",
    type: "Seniores",
  },
  {
    id: "seniores-2",
    title: "Hóquei Clube PDL vs HCP Grândola",
    date: "11/04/2026",
    time: "16:00",
    location: "Pavilhão Sidónio Serpa",
    type: "Seniores",
  },
  {
    id: "seniores-3",
    title: "Hóquei Clube PDL vs HC Sintra",
    date: "02/05/2026",
    time: "16:00",
    location: "Pavilhão Sidónio Serpa",
    type: "Seniores",
  },
  {
    id: "seniores-4",
    title: "Hóquei Clube PDL vs CD Boliqueime",
    date: "23/05/2026",
    time: "16:00",
    location: "Pavilhão Sidónio Serpa",
    type: "Seniores",
  }
];

export const formacaoEvents = [
  {
    id: "formacao-1",
    title: "Hóquei Clube PDL vs Caldeiras HC",
    date: "21/03/2026",
    time: "17:00",
    location: "Pavilhão Sidónio Serpa",
    type: "Sub 11",
  },
  {
    id: "formacao-2",
    title: "Hóquei Clube PDL vs Caldeiras HC",
    date: "22/03/2026",
    time: "10:00",
    location: "Pavilhão Sidónio Serpa",
    type: "Sub 13",
  }
];

export const comunicados = [
  {
    id: 5,
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
    titulo: "VENCEDORES Sub-13",
    data: "01/03/2026",
    conteudo:
      "O escalão de formação Sub-13 do Hóquei Clube PDL sagraram-se Campeões Regionais...",
  },
  {
    id: 2,
    titulo: "VENCEDORES Sub-17",
    data: "01/03/2026",
    conteudo:
      "O escalão de formação Sub-17 do Hóquei Clube PDL sagraram-se vencedores do Campeonato de São Miguel...",
  },
  {
    id: 3,
    titulo: "VENCEDORES Sub-13",
    data: "15/02/2026",
    conteudo:
      "O escalão de formação Sub-13 do Hóquei Clube PDL sagraram-se vencedores do Campeonato de São Miguel...",
  },
  {
    id: 4,
    titulo: "VENCEDORES Sub-13 e Sub-17",
    data: "28/09/2025",
    conteudo:
      "Os escalões de formação Sub-13 e Sub-17 do Hóquei Clube PDL sagraram-se vencedores do Torneio Cidade da Ribeira Grande...",
  }
];

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
      { day: "Terça", time: "19:00 - 20:00" },
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

export const sponsors = [
  { name: "Azemad", logo: "/uploads/AzemadLogo.jpg", url: "https://azemad.com/" },
  { name: "Auto Cordeiro", logo: "/uploads/AutoCordeiroLogo1.png", url: "https://autocordeiro.com" },
  { name: "Crenku", logo: "/uploads/CrenkuLogo.png", url: "https://www.facebook.com/crenku/?locale=pt_PT" },
  { name: "Catchawards", logo: "/uploads/catchawards.png", url: "https://www.catchawardsportugal.pt/" },
  { name: "Agência Funerária Lindo", logo: "/uploads/FunerariaLindoLogo.jpg", url: "https://www.facebook.com/funerarialindo/?locale=pt_PT" },
];