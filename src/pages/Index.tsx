
import { useState } from 'react';
import { Navigation } from "@/components/Navigation";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SocialIcons } from "@/components/SocialIcons";
import Autoplay from "embla-carousel-autoplay";

import { Card } from "@/components/ui/card";
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
  "Guarda-Redes": ["Nuno Teixeira", "Simão Loureiro"],
  "Defesa": ["Tiago Pimentel", "Mario Jesus", "Sandro Melo", "Tiago Botelho"],
  "Médio": ["Alexandre Resendes", "Vicente"],
  "Avançado": ["Miguel Pimentel", "Carlos Guimarães", "Tiago Leite", "Alexandre Ornelas"],
  "Universal": ["Pedro Paula", "Francisco Freitas"]
};

const staff = [
  { name: "Herbeto Resendes", role: "Treinador" },
  { name: "Manuel Ferreira", role: "Diretor" },
  { name: "Paulo", role: "Preparador Físico" }
];

const senioresEvents = [
  {
    title: "Candelária SC B vs HC PDL",
    date: "21-06-2025",
    time: "20:00",
    location: "Pavilhão Sidónio Serpa",
  },
  {
    title: "HC PDL vs Candelária SC B",
    date: "22-06-2025",
    time: "15:00",
    location: "Pavilhão Sidónio Serpa",
  },
];

const formacaoEvents = [
  {
    title: "HC PDL vs Caldeiras HC",
    date: "14-05-2025",
    time: "14:30",
    location: "Pavilhão Sidónio Serpa",
    type: "Escolares",
  },
  {
    title: "Maritimo SC vs HC PDL",
    date: "15-05-2025",
    time: "11:30",
    location: "Pavilhão Carlos Silveira",
    type: "Sub 13",
  },
  {
    title: "HC PDL vs Caldeiras HC",
    date: "16-05-2025",
    time: "17:30",
    location: "Pavilhão Sidónio Serpa",
    type: "Sub15",
  },
  {
    title: "Maritimo SC vs HC PDL",
    date: "17-05-2025",
    time: "16:30",
    location: "Pavilhão Carlos Silveira",
    type: "Sub 17",
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


const Index = () => {
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  
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

  // Force refresh - no events variable exists anymore
  console.log("Index component loaded successfully");
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <SocialIcons />
      <ScrollToTop />

      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-primary/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Hóquei Clube Ponta Delgada
            </h1>
            <p className="text-xl text-gray-600 mb-8">Paixão, Orgulho e Excelência desde 2012</p>
          </div>
        </div>
      </section>

      {/* About Section */}
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

      {/* Events Section */}
      <section id="events" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Próximos Jogos</h2>
          
          <h3 className="text-2xl font-semibold mb-6">Seniores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {senioresEvents.map((event) => (
              <Card key={event.title} className="p-6 hover:shadow-lg transition-shadow relative">
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
            {formacaoEvents.map((event) => (
              <Card key={event.title} className="p-6 hover:shadow-lg transition-shadow relative">
                <div className="absolute top-4 right-4 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">
                  {event.type}
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
                          alt={`Galeria ${index + 1}`} 
                          className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                        />
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl w-full h-full max-h-[90vh] p-0 border-0 bg-black/95">
                        <div className="relative w-full h-full flex items-center justify-center p-4">
                          <img 
                            src={image} 
                            alt={`Galeria ${index + 1}`} 
                            className="max-w-full max-h-full object-contain rounded-lg"
                          />
                        </div>
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Hóquei Clube Ponta Delgada. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
