// src/data/siteData.ts

export const playersByPosition = {
  "Guarda-Redes": ["Nuno Teixeira", "Simão Loureiro", "Miguel Santos"],
  "Defesa": ["Tiago Pimentel", "Mario Jesus"],
  "Médio": ["Alexandre Resendes", "Alexandre Ornelas"],
  "Avançado": ["Miguel Pimentel", "Carlos Guimarães", "Tiago Leite", "Pedro Soares"],
  "Universal": ["Pedro Paula", "Francisco Freitas", "Vicente Correia"]
};

export const staff = [
  { name: "Herberto Resendes", role: "Treinador" },
  { name: "João Oliveira", role: "Diretor" },
  { name: "Paulo Benjamim", role: "Diretor" },
  { name: "Fernando Pimentel", role: "Diretor" },
  { name: "Paulo Correia", role: "Preparador Físico" }
];

export const senioresEvents = [
  {
    id: "seniores-1",
    title: "Hóquei Clube PDL vs Stuart HC Massamá",
    date: "22/11/2025",
    time: "16:00",
    location: "Pavilhão Sidónio Serpa",
    type: "Seniores",
  },
  {
    id: "seniores-2",
    title: "Taça de Portugal (32 Avos de Final) - Hóquei Clube PDL vs A DEFINIR",
    date: "29/12/2025",
    time: "00:00",
    location: "A DEFINIR",
    type: "Seniores",
  },
  {
    id: "seniores-3",
    title: "Hóquei Clube PDL vs UDC Nafarros",
    date: "13/12/2025",
    time: "16:00",
    location: "Pavilhão Sidónio Serpa",
    type: "Seniores",
  }
];

export const formacaoEvents = [
  {
    id: "formacao-1",
    title: "Caldeiras HC 5 - 9 Hóquei Clube PDL",
    date: "01/11/2025",
    time: "13:30",
    location: "CD Ribeira Grande",
    type: "Sub 11",
  },
  {
    id: "formacao-2",
    title: "Caldeiras HC 2 - 14 Hóquei Clube PDL",
    date: "02/11/2025",
    time: "09:30",
    location: "CD Ribeira Grande",
    type: "Sub 13",
  },
  {
    id: "formacao-3",
    title: "Caldeiras HC 5 - 6 Hóquei Clube PDL",
    date: "02/11/2025",
    time: "11:30",
    location: "CD Ribeira Grande",
    type: "Sub 17",
  },
  {
    id: "formacao-4",
    title: "Hóquei Clube PDL vs Caldeiras HC",
    date: "23/11/2025",
    time: "10:00",
    location: "Pavilhão Sidónio Serpa",
    type: "Sub 13",
  },
  {
    id: "formacao-5",
    title: "Marítimo SC vs Hóquei Clube PDL",
    date: "30/11/2025",
    time: "11:30",
    location: "Pavilhão Carlos Silveira",
    type: "Sub 17",
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
  "/lovable-uploads/6f004096-7b4b-46fc-900c-5a739fb46b49.png",
  "/lovable-uploads/bb357729-6191-4dec-bdc6-e9b22898bd63.png",
  "/lovable-uploads/18941c1a-b681-46a8-b651-0e812f6192b0.png",
  "/lovable-uploads/b2a3a926-e3f0-469c-9390-0113bfb380ea.png",
  "/lovable-uploads/57e06117-8822-4287-8b8c-e947952330c8.png",
  "/lovable-uploads/cc047543-aa40-46cb-8746-4b1324dba1a4.png",
  "/lovable-uploads/c36667ca-9257-4046-9d64-b47bc79a4ba3.png",
  "/lovable-uploads/182a9396-5de5-4efe-a1d8-39b0a2180269.png",
  "/lovable-uploads/TorneioCidadeRG_PDL_Campeao_Sub13_Sub17.jpeg"
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
    { name: "Azemad", logo: "/lovable-uploads/AzemadLogo.jpg", url: "https://azemad.com/" },
    { name: "AutoCordeiro", logo: "/lovable-uploads/AutoCordeiroLogo.png", url: "https://www.facebook.com/crenku/?locale=pt_PT" },
    { name: "Crenku", logo: "/lovable-uploads/CrenkuLogo.png", url: "https://www.facebook.com/engenhososdesafios/?locale=pt_PT" },
    { name: "Catchawards", logo: "/lovable-uploads/catchawards.png", url: "https://www.catchawardsportugal.pt/" },
];