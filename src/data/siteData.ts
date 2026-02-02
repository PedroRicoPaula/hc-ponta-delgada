// src/data/siteData.ts

export const playersByPosition = {
  "Guarda-Redes": ["Nuno Teixeira", "Simão Loureiro"],
  "Defesa": ["Tiago Pimentel", "Mario Jesus"],
  "Médio": ["Alexandre Resendes", "Alexandre Ornelas"],
  "Avançado": ["Miguel Pimentel", "Carlos Guimarães", "Tiago Leite"],
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
    title: "Hóquei Clube PDL vs HC Santiago",
    date: "07/02/2026",
    time: "16:00",
    location: "Pavilhão Sidónio Serpa",
    type: "Seniores",
  },
  {
    id: "seniores-2",
    title: "Hóquei Clube PDL vs GD Sesimbra",
    date: "28/02/2026",
    time: "16:00",
    location: "Pavilhão Sidónio Serpa",
    type: "Seniores",
  }
];

export const formacaoEvents = [
  {
    id: "formacao-1",
    title: "Caldeiras HC vs Hóquei Clube PDL",
    date: "08/02/2026",
    time: "10:30",
    location: "CD Ribeira Grande",
    type: "Sub 11",
  },
  {
    id: "formacao-2",
    title: "Marítimo SC vs Hóquei Clube PDL",
    date: "08/02/2026",
    time: "14:00",
    location: "Pavilhão Carlos Silveira",
    type: "Sub 17",
  },
  {
    id: "formacao-3",
    title: "Hóquei Clube PDL vs Caldeiras HC",
    date: "15/02/2026",
    time: "10:00",
    location: "Pavilhão Sidónio Serpa",
    type: "Sub 13",
  },
  {
    id: "formacao-4",
    title: "Hóquei Clube PDL vs Caldeiras HC",
    date: "15/02/2026",
    time: "12:00",
    location: "Pavilhão Sidónio Serpa",
    type: "Sub 17",
  },
  {
    id: "formacao-5",
    title: "Caldeiras HC vs Hóquei Clube PDL",
    date: "22/02/2026",
    time: "11:30",
    location: "CD Ribeira Grande",
    type: "Sub 17",
  },
  {
    id: "formacao-6",
    title: "Hóquei Clube PDL vs Caldeiras HC",
    date: "27/02/2026",
    time: "10:00",
    location: "Pavilhão Sidónio Serpa",
    type: "Sub 13",
  },
  {
    id: "formacao-7",
    title: "Candelária SC vs Hóquei Clube PDL",
    date: "27/02/2026",
    time: "19:00",
    location: "Pavilhão Sidónio Serpa",
    type: "Sub 13",
  },
  {
    id: "formacao-8",
    title: "Hóquei Clube PDL vs Candelária SC",
    date: "28/02/2026",
    time: "18:00",
    location: "Pavilhão Sidónio Serpa",
    type: "Sub 13",
  },
  {
    id: "formacao-9",
    title: "Caldeiras HC vs Hóquei Clube PDL",
    date: "01/03/2026",
    time: "18:00",
    location: "Pavilhão Sidónio Serpa",
    type: "Sub 13",
  },
];

export const comunicados = [
  {
    id: 1,
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
  "/uploads/TorneioCidadeRG_PDL_Campeao_Sub13_Sub17.jpeg"
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