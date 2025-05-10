
import { useState } from 'react';
import { Navigation } from "@/components/Navigation";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SocialIcons } from "@/components/SocialIcons";
import { ShopSection } from "@/components/ShopSection";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const teamMembers = [
  {
    name: "Pedro Paula",
    position: "Universal",
    image: "/lovable-uploads/pp.png",
    contractImage: "/lovable-uploads/pp-contract.png"
  },
  {
    name: "Francisco Freitas",
    position: "Universal",
    image: "/lovable-uploads/ff.png",
    contractImage: "/lovable-uploads/ff-contract.png"
  },
  {
    name: "Rodrigo Pimentel",
    position: "Médio",
    image: "/lovable-uploads/rp.png",
    contractImage: "/lovable-uploads/rp-contract.png"
  },
  {
    name: "Tiago Pimentel",
    position: "Defesa",
    image: "/lovable-uploads/tp.png",
    contractImage: "/lovable-uploads/tp-contract.png"
  },
  {
    name: "Miguel Pimentel",
    position: "Avançado",
    image: "/lovable-uploads/mp.png",
    contractImage: "/lovable-uploads/mp-contract.png"
  },
  {
    name: "Carlos Guimarães",
    position: "Avançado",
    image: "/lovable-uploads/cg.png",
    contractImage: "/lovable-uploads/cg-contract.png"
  },
  {
    name: "Pedro Soares",
    position: "Avançado",
    image: "/lovable-uploads/ps.png",
    contractImage: "/lovable-uploads/ps-contract.png"
  },
  {
    name: "Nuno Teixeira",
    position: "Guarda-Redes",
    image: "/lovable-uploads/nt.png",
    contractImage: "/lovable-uploads/nt-contract.png"
  },
  {
    name: "Mario Jesus",
    position: "Defesa",
    image: "/lovable-uploads/mj.png",
    contractImage: "/lovable-uploads/mj-contract.png"
  },
  {
    name: "Sandro Melo",
    position: "Defesa",
    image: "/lovable-uploads/sm.png",
    contractImage: "/lovable-uploads/sm-contract.png"
  },
  {
    name: "Micael Tavares",
    position: "Guarda-Redes",
    image: "/lovable-uploads/mt.png",
    contractImage: "/lovable-uploads/mt-contract.png"
  },
  {
    name: "Fabio Larsen",
    position: "Médio",
    image: "/lovable-uploads/fl.png",
    contractImage: "/lovable-uploads/fl-contract.png"
  }
];

const staff = [
  { name: "Herbeto Resendes", role: "Treinador" },
  { name: "João Oliveira", role: "Diretor" },
  { name: "João Sardinha", role: "DJ" },
  { name: "Luis Pacheco", role: "Massagista" },
  { name: "Fernando Pimentel", role: "Diretor" }
];

const events = [
  {
    title: "HC PDL vs GDR Ilha",
    date: "2025-05-01",
    time: "20:00",
    location: "Pavilhão Municipal Sidónio Serpa",
  },
  {
    title: "CD Povoa vs HC PDL",
    date: "2025-05-15",
    time: "19:30",
    location: "Pavilhão Municipal da Póvoa de Varzim",
  },
  {
    title: "HC PDL vs HC Braga",
    date: "2025-05-29",
    time: "21:00",
    location: "Pavilhão Municipal Sidónio Serpa",
  },
];

const galleryImages = [
  "/lovable-uploads/6f004096-7b4b-46fc-900c-5a739fb46b49.png",
  "/lovable-uploads/bb357729-6191-4dec-bdc6-e9b22898bd63.png",
  "/lovable-uploads/18941c1a-b681-46a8-b651-0e812f6192b0.png",
  "/lovable-uploads/b2a3a926-e3f0-469c-9390-0113bfb380ea.png",
  "/lovable-uploads/57e06117-8822-4287-8b8c-e947952330c8.png",
  "/lovable-uploads/cc047543-aa40-46cb-8746-4b1324dba1a4.png",
  "/lovable-uploads/c36667ca-9257-4046-9d64-b47bc79a4ba3.png"
];

const PlayerCard = ({ player }) => {
  const [showContract, setShowContract] = useState(false);

  return (
    <Card 
      className="p-4 hover:shadow-lg transition-all duration-300 transform cursor-pointer overflow-hidden"
      onClick={() => setShowContract(!showContract)}
    >
      <div className={`transition-all duration-300 ${showContract ? 'scale-105' : ''}`}>
        <div className="w-36 h-36 mx-auto mb-4 overflow-hidden">
          <img
            src={showContract ? player.contractImage : player.image}
            alt={player.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-lg mb-1">{player.name}</h3>
          <p className="text-gray-600 text-sm">{player.position}</p>
        </div>
      </div>
    </Card>
  );
};

const Index = () => {
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

      {/* Team Section */}
      <section id="team" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Nossa Equipa</h2>
          
          <h3 className="text-2xl font-semibold mb-6">Jogadores</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {teamMembers.map((player) => (
              <PlayerCard key={player.name} player={player} />
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
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {galleryImages.map((image, index) => (
                <CarouselItem key={index} className="basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="p-2">
                    <img 
                      src={image} 
                      alt={`Galeria ${index + 1}`} 
                      className="w-full h-64 object-cover rounded-lg"
                    />
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

      {/* Events Section */}
      <section id="events" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Próximos Jogos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.title} className="p-6 hover:shadow-lg transition-shadow">
                <div>
                  <h3 className="font-semibold text-xl mb-2">{event.title}</h3>
                  <p className="text-gray-600">Data: {event.date}</p>
                  <p className="text-gray-600">Hora: {event.time}</p>
                  <p className="text-gray-600">Local: {event.location}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <ShopSection />

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
