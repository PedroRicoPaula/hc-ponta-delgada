import { useState, useEffect } from 'react';
import { Navigation } from "@/components/Navigation";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SocialIcons } from "@/components/SocialIcons";
import { RollerHockeyGame } from "@/components/RollerHockeyGame";
import Autoplay from "embla-carousel-autoplay";
import { Gamepad2, Megaphone, Heart, X, Copy } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

const playersByPosition = {
  "Guarda-Redes": ["Nuno Teixeira", "Simão Loureiro", "Miguel Santos"],
  "Defesa": ["Tiago Pimentel", "Mario Jesus", "Vicente Correia"],
  "Médio": ["Alexandre Resendes", "Alexandre Ornelas"],
  "Avançado": ["Miguel Pimentel", "Carlos Guimarães", "Tiago Leite"],
  "Universal": ["Pedro Paula", "Francisco Freitas"]
};

const staff = [
  { name: "Herbeto Resendes", role: "Treinador" },
  { name: "João Oliveira", role: "Diretor" },
  { name: "Paulo Benjamim", role: "Diretor" },
  { name: "Fernando Pimentel", role: "Diretor" },
  { name: "Paulo Correia", role: "Preparador Físico" },
  { name: "João Sardinha", role: "Segurança" }
];

const senioresEvents = [
  {
    id: "seniores-1",
    title: "HC PDL vs HC Vasco da Gama",
    date: "11/10/2025",
    time: "17:00",
    location: "Pavilhão Sidónio Serpa",
  },
  {
    id: "seniores-2",
    title: "HC PDL vs Juv. Azeitonense",
    date: "01/11/2025",
    time: "17:00",
    location: "Pavilhão Sidónio Serpa",
  },
];

const formacaoEvents = [
  {
    id: "formacao-1",
    title: "Hóquei Clube PDL vs Caldeiras HC",
    date: "27/09/2025",
    time: "14:30",
    location: "CD Ribeira Grande",
    type: "Sub 13",
  },
  {
    id: "formacao-2",
    title: "Hóquei Clube PDL vs Marítimo SC",
    date: "28/09/2025",
    time: "10:00",
    location: "CD Ribeira Grande",
    type: "Sub 13",
  },
  {
    id: "formacao-3",
    title: "Maritimo SC vs Hóquei Clube PDL",
    date: "28/09/2025",
    time: "11:30",
    location: "CD Ribeira Grande",
    type: "Sub 17",
  },
  {
    id: "formacao-4",
    title: "Caldeiras HC vs Hóquei Clube PDL",
    date: "28/09/2025",
    time: "18:30",
    location: "CD Ribeira Grande",
    type: "Sub 17",
  },
];

// Comunicados
const comunicados = [
  {
    id: 1,
    titulo: "Torneio das Vindimas",
    data: "19/09/2025",
    conteudo:
      "Participação da equipa senior no torneio das vindimas contra o Candelária SC 27 e 28",
  },
  {
    id: 2,
    titulo: "Jogos dos Seniores",
    data: "10/09/2025",
    conteudo:
      "O Hóquei Clube Ponta Delgada irá começar a participação no campeonato nacional a dia 4 de Outubro de 2025 fora contra o HC Santiago.",
  },
];

const galleryImages = [
  "/lovable-uploads/6f004096-7b4b-46fc-900c-5a739fb46b49.png",
  "/lovable-uploads/bb357729-6191-4dec-bdc6-e9b22898bd63.png",
  "/lovable-uploads/18941c1a-b681-46a8-b651-0e812f6192b0.png",
  "/lovable-uploads/b2a3a926-e3f0-469c-9390-0113bfb380ea.png",
  "/lovable-uploads/57e06117-8822-4287-8b8c-e947952330c8.png",
  "/lovable-uploads/cc047543-aa40-46cb-8746-4b1324dba1a4.png",
  "/lovable-uploads/c36667ca-9257-4046-9d64-b47bc79a4ba3.png",
  "/lovable-uploads/182a9396-5de5-4efe-a1d8-39b0a2180269.png"
];


const trainingSchedules = [
  {
    type: "Escolares",
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


const Index = () => {
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [openSchedules, setOpenSchedules] = useState<{ [key: string]: boolean }>({});
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isComunicadosOpen, setIsComunicadosOpen] = useState(false);
  const [isDonationsOpen, setIsDonationsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      setShowCookieConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowCookieConsent(false);
  };

  const rejectCookies = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setShowCookieConsent(false);
  };
  
  const autoplayPlugin = Autoplay({
    delay: 3000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });

  const handleCarouselClick = () => {
    if (isAutoplayPaused) {
      autoplayPlugin.play();
    } else {
      autoplayPlugin.stop();
    }
    setIsAutoplayPaused(!isAutoplayPaused);
  };

  const toggleSchedule = (type: string) => {
    setOpenSchedules(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("PT50001000004864920000107");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Force refresh - no events variable exists anymore
  console.log("Index component loaded successfully");
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <SocialIcons />
      <ScrollToTop />

      {/* Comunicados Button */}
      <button
        onClick={() => setIsComunicadosOpen(true)}
        className="fixed right-4 top-[calc(40%-120px)] sm:top-[calc(50%-120px)] z-40 bg-blue-500 hover:bg-blue-600 text-white p-2 sm:p-3 rounded-l-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 group"
        aria-label="Ver comunicados"
      >
        <Megaphone className="h-5 w-5 sm:h-6 sm:w-6 group-hover:animate-pulse" />
      </button>
      
      {/* Floating Game Button */}
      <button
        onClick={() => setIsGameOpen(true)}
        className="fixed right-4 top-[55%] sm:top-1/2 -translate-y-1/2 z-40 bg-gradient-to-b from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground p-2 sm:p-3 rounded-l-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-x-1 group"
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
      >
        <div className="flex flex-col items-center gap-2">
          <Gamepad2 className="h-5 w-5 sm:h-6 sm:w-6 group-hover:animate-pulse" />
          <span className="hidden sm:block font-semibold text-sm tracking-wide">MINI JOGO</span>
        </div>
      </button>

      {/* Roller Hockey Game Overlay */}
      <RollerHockeyGame isOpen={isGameOpen} onClose={() => setIsGameOpen(false)} />

      <>
        <div 
          className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${isComunicadosOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsComunicadosOpen(false)}
        />
        <div
          className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isComunicadosOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="p-6 relative h-full">
            <button
              onClick={() => setIsComunicadosOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              aria-label="Fechar comunicados"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4">Comunicados</h2>
            <div className="h-[calc(100%-50px)] overflow-y-auto pr-2 space-y-4">
            {comunicados.map((comunicado) => (
              <div 
                key={comunicado.id} 
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition bg-gray-50"
              >
                <h3 className="text-lg font-semibold text-primary mb-1">
                  {comunicado.titulo}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{comunicado.data}</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {comunicado.conteudo}
                </p>
              </div>
            ))}
          </div>
          </div>
        </div>
      </>

      <>
        {/* Modal Doações */}
      <div className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${isDonationsOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsDonationsOpen(false)} />
      <div className={`fixed bottom-0 left-0 right-0 bg-white shadow-t-2xl z-50 transform transition-transform duration-300 ease-in-out ${isDonationsOpen ? 'translate-y-0' : 'translate-y-full'} p-6 rounded-t-2xl max-w-2xl mx-auto`}>
        <button onClick={() => setIsDonationsOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X className="h-6 w-6" />
        </button>
        <div className="text-center">
          <Heart className="mx-auto h-12 w-12 text-primary mb-3" />
          <h2 className="text-2xl font-bold mb-2">Apoie o Clube!</h2>
          <p className="text-gray-600 mb-4">
            A sua doação ajuda a financiar os nossos equipamentos, viagens e a formação dos nossos jovens atletas. Qualquer contribuição faz a diferença. Obrigado pelo seu apoio!
          </p>

          {/* IBAN com botão copiar */}
          <div className="bg-gray-100 p-3 rounded-lg relative inline-block">
            {copied && (
              <span className="absolute -top-6 right-3 text-xs text-green-600 font-medium">
                Copiado!
              </span>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">IBAN</p>
                <p className="text-lg font-mono tracking-wider text-gray-900">PT50 0010 0000 4864 9200 0010 7</p>
              </div>
              <Button variant="ghost" size="icon" className="ml-3 hover:bg-gray-200" onClick={handleCopy} aria-label="Copiar IBAN">
                <Copy className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      </>

      {/* Hero Section */}
      <header className="pt-20 pb-12 bg-gradient-to-b from-primary/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Hóquei Clube Ponta Delgada
            </h1>
            <p className="text-xl text-gray-600 mb-8">Paixão, Orgulho e Excelência desde 2012</p>
            <img
              src="/lovable-uploads/PDL24-25V2.png" 
              alt="Hóquei Clube Ponta Delgada"
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </header>

      {/* Scroll Indicator */}
      <div className="flex justify-center py-8">
        <div className="animate-bounce">
          <svg 
            className="w-8 h-12 text-primary opacity-70" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 32 48" 
            stroke="currentColor"
          >
            {/* Mouse body */}
            <rect x="8" y="8" width="16" height="32" rx="8" ry="8" fill="none" stroke="currentColor"/>
            {/* Scroll wheel indicator */}
            <circle cx="16" cy="18" r="2" fill="currentColor" className="animate-pulse"/>
            {/* Scroll line */}
            <path d="M16 22v6" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </div>
      </div>

      {/* About Section */}
      <main>
        <section id="about" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">Sobre Nós</h2>
            <p className="text-gray-600 text-lg text-center max-w-3xl mx-auto">
              Fundado em 2012, o Hóquei Clube de Ponta Delgada tem sido um símbolo de excelência desportiva nos Açores.
              O nosso compromisso com o desenvolvimento de jovens talentos e a promoção do hóquei na região tornou-nos
              um dos clubes mais respeitados em Portugal.
            </p>
          </div>
        </section>

      {/* Training Schedules Section */}
      <section id="training" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Horários de Treinos</h2>
          
          {/* Desktop View */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
            {trainingSchedules.map((schedule) => (
              <Card key={schedule.type} className={`p-6 border-2 ${schedule.color} hover:shadow-lg transition-shadow`}>
                <div className="text-center">
                  <h3 className="font-bold text-xl mb-4">{schedule.type}</h3>
                  <div className="space-y-3">
                    {schedule.sessions.map((session, index) => (
                      <div key={index} className="bg-white/50 p-3 rounded-lg">
                        <p className="font-semibold text-sm">{session.day}</p>
                        <p className="text-sm font-mono">{session.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Mobile View - Collapsible */}
          <div className="md:hidden space-y-4">
            {trainingSchedules.map((schedule) => (
              <Card key={schedule.type} className={`border-2 ${schedule.color} overflow-hidden`}>
                <Button
                  onClick={() => toggleSchedule(schedule.type)}
                  className={`w-full p-4 text-left flex justify-between items-center ${schedule.color} hover:opacity-90 transition-all`}
                  variant="ghost"
                >
                  <h3 className="font-bold text-lg">{schedule.type}</h3>
                  <span className={`transform transition-transform duration-200 ${openSchedules[schedule.type] ? 'rotate-180' : 'rotate-0'}`}>
                    ↓
                  </span>
                </Button>
                <div className={`transition-all duration-300 ease-in-out ${openSchedules[schedule.type] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                  <div className="p-4 bg-white/50 space-y-3">
                    {schedule.sessions.map((session, index) => (
                      <div key={index} className="bg-white/70 p-3 rounded-lg">
                        <p className="font-semibold text-sm">{session.day}</p>
                        <p className="text-sm font-mono">{session.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Próximos Jogos</h2>
          
          <h3 className="text-2xl font-semibold mb-6">Seniores (Casa)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {senioresEvents.map((event) => (
              <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow relative">
                <div className="absolute top-4 right-4 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">
                  Seniores
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2 pr-20">{event.title}</h3>
                  <p className="text-gray-600">Data: {event.date}</p>
                  <p className="text-gray-600">Hora: {event.time}</p>
                  <p className="text-gray-600">Local: {event.location}</p>
                </div>
              </Card>
            ))}
          </div>

          <h3 className="text-2xl font-semibold mb-6">Formação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formacaoEvents.map((event) => {
              const getEventTypeColor = (type: string) => {
                switch (type) {
                  case "Escolares":
                    return "bg-yellow-100 text-yellow-700";
                  case "Sub 13":
                    return "bg-green-100 text-green-700";
                  case "Sub15":
                    return "bg-blue-100 text-blue-700";
                  case "Sub 17":
                    return "bg-purple-100 text-purple-700";
                  default:
                    return "bg-primary/10 text-primary";
                }
              };
              
              return (
                <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow relative">
                  <div className={`absolute top-4 right-4 px-2 py-1 rounded-md text-sm font-medium ${getEventTypeColor(event.type)}`}>
                    {event.type}
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 pr-20">{event.title}</h3>
                    <p className="text-gray-600">Data: {event.date}</p>
                    <p className="text-gray-600">Hora: {event.time}</p>
                    <p className="text-gray-600">Local: {event.location}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Equipa</h2>
          
          <h3 className="text-2xl font-semibold mb-6">Jogadores</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
            {Object.entries(playersByPosition).map(([position, players]) => (
              <Card key={position} className="p-4 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <h4 className="font-semibold text-lg mb-3 text-primary">{position}</h4>
                  <ul className="space-y-1">
                    {players.map((playerName) => (
                      <li key={playerName} className="text-gray-700">{playerName}</li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>

          <h3 className="text-2xl font-semibold mb-6">Equipa Técnica</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {staff.map((member) => (
              <Card key={member.name} className="p-4 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-gray-600 text-sm">{member.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Galeria</h2>
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              {isAutoplayPaused ? "Clique para retomar" : "Clique para pausar"} | Arrasta para ver mais
            </p>
          </div>
          <Carousel 
            className="w-full max-w-4xl mx-auto cursor-pointer"
            plugins={[autoplayPlugin]}
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
            }}
            onClick={handleCarouselClick}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {galleryImages.map((image, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="p-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <img 
                          src={image} 
                          alt={`Hóquei Clube Ponta Delgada - Momento ${index + 1} dos nossos treinos e jogos`} 
                          className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                          loading="lazy"
                        />
                      </DialogTrigger>
                      <DialogContent className="max-w-full max-h-screen sm:max-w-[98vw] sm:max-h-[98vh] md:max-w-[80vw] md:max-h-[80vh] w-auto h-auto p-0 sm:p-2 border-0 bg-black/90 flex items-center justify-center [&>button]:absolute [&>button]:right-3 [&>button]:top-3 [&>button]:bg-black/50 [&>button]:text-white [&>button]:hover:bg-black/70 [&>button]:rounded-full [&>button]:p-2.5 sm:[&>button]:p-2 [&>button]:border-0 [&>button]:shadow-lg">
                        <img 
                          src={image} 
                          alt={`Hóquei Clube Ponta Delgada - Momento ${index + 1} dos nossos treinos e jogos`} 
                          className="max-w-full max-h-[98vh] md:max-h-[75vh] w-auto h-auto object-contain sm:rounded-lg"
                          loading="lazy"
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-4">
              <CarouselPrevious className="mx-2 relative static lg:-left-0 translate-y-0" />
              <CarouselNext className="mx-2 relative static lg:-right-0 translate-y-0" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Sponsors Section */}
      <section id="sponsors" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Patrocinadores</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center justify-items-center">
            {[
              { name: "Azemad", logo: "/lovable-uploads/AzemadLogo.jpg" },
              { name: "AutoCordeiro", logo: "/lovable-uploads/AutoCordeiroLogo.png" },
              { name: "Crenku", logo: "/lovable-uploads/CrenkuLogo.png" },
            ].map((sponsor) => (
              <div
                key={sponsor.name}
                className="flex flex-col items-center p-4 hover:scale-105 transition-transform duration-300"
              >
                {/* Logo container ensures uniform size */}
                <div className="h-20 w-40 flex items-center justify-center">
                  <img
                    src={sponsor.logo}
                    alt={`${sponsor.name} Logo`}
                    className="max-h-full max-w-full object-contain opacity-80 hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                </div>
                <span className="text-gray-700 font-medium text-center mt-3">{sponsor.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Contactos</h2>
          <div className="text-center">
            <p className="text-gray-600 mb-2">Email: hoqueiclube.pdl@gmail.com</p>
            <p className="text-gray-600 mb-2">Telefone: +351 296 382 987</p>
            <p className="text-gray-600">Morada: Rua do Mercado, 31, 9500-326 Ponta Delgada, Açores</p>
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-4">&copy; 2025 Hóquei Clube Ponta Delgada. Todos os direitos reservados.</p>
          <Button 
            variant="outline" 
            className="bg-transparent border-primary text-primary hover:bg-primary hover:text-white"
            onClick={() => setIsDonationsOpen(true)}
          >
            <Heart className="mr-2 h-4 w-4" /> Fazer uma Doação
          </Button>
        </div>
      </footer>

      {/* Cookie Consent */}
      {showCookieConsent && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
          <div className="flex flex-col space-y-2">
            <p className="text-xs text-gray-600">
              Este site utiliza cookies para melhorar a sua experiência de navegação.
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={acceptCookies}
                className="flex-1 bg-primary hover:bg-primary/90 text-white text-xs py-1 h-8"
              >
                Aceitar
              </Button>
              <Button 
                onClick={rejectCookies}
                variant="outline"
                className="flex-1 text-xs py-1 h-8"
              >
                Não aceitar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
