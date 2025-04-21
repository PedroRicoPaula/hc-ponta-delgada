import { useState } from 'react';
import { Navigation } from "@/components/Navigation";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Card } from "@/components/ui/card";

const teamMembers = [
  {
    name: "Pedro Soares",
    position: "Guarda-Redes",
    number: "10",
    image: "/lovable-uploads/fdb8eb48-29a0-4a02-8d1e-a30eecfa48e8.png",
    contractImage: "/lovable-uploads/2ebf48ac-7c00-45d7-a177-343ebe1b69f6.png"
  },
  {
    name: "Tiago Pimentel",
    position: "Guarda-Redes",
    number: "5",
    image: "/lovable-uploads/43003c09-106e-4e90-875d-131317a6b0eb.png",
    contractImage: "/lovable-uploads/2160de16-0a56-4902-bdd0-fee6d3396a27.png"
  },
  {
    name: "Melo",
    position: "Universal",
    number: "7",
    image: "/lovable-uploads/fa88278c-cddb-4920-812a-a17dc743d19a.png",
    contractImage: "/lovable-uploads/0dc06dca-1c67-4c5f-b2b3-b1c7a18e8446.png"
  },
  {
    name: "Teixeira",
    position: "Universal",
    number: "8",
    image: "/lovable-uploads/53329e21-20fc-4c4f-ba94-faae834ddcb2.png",
    contractImage: "/lovable-uploads/932eb9f6-67c4-425e-a917-3f8257e4914f.png"
  },
  {
    name: "Guimarães",
    position: "Universal",
    number: "9",
    image: "/lovable-uploads/fb993026-d7ad-4b9b-a0c3-370498d3b75d.png",
    contractImage: "/lovable-uploads/7316a3cf-6948-4713-886e-73ae6fc0609c.png"
  },
  {
    name: "Carlos",
    position: "Universal",
    number: "4",
    image: "/lovable-uploads/911730c6-4f3a-4cca-a97b-f012ebfe7cc0.png",
    contractImage: "/lovable-uploads/cd862324-b486-40c6-bad7-a8fb64a16cfa.png"
  }
];

const staff = [
  { name: "José Medeiros", role: "Treinador Principal" },
  { name: "João Tavares", role: "Treinador Adjunto" },
  { name: "Pedro Silva", role: "Diretor Técnico" },
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
  "/placeholder.svg",
  "/placeholder.svg",
  "/placeholder.svg",
  "/placeholder.svg",
  "/placeholder.svg",
];

const PlayerCard = ({ player }) => {
  const [showContract, setShowContract] = useState(false);

  return (
    <Card 
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer relative overflow-hidden"
      onClick={() => setShowContract(!showContract)}
    >
      <img
        src={showContract ? player.contractImage : player.image}
        alt={player.name}
        className="w-full h-64 object-cover mb-4 transition-opacity duration-300"
      />
      <div className="text-center">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl font-bold text-primary-foreground">{player.number}</span>
        </div>
        <h3 className="font-semibold text-xl mb-2">{player.name}</h3>
        <p className="text-gray-600">{player.position}</p>
      </div>
    </Card>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {teamMembers.map((player) => (
              <PlayerCard key={player.name} player={player} />
            ))}
          </div>

          <h3 className="text-2xl font-semibold mb-6">Equipa Técnica</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {staff.map((member) => (
              <Card key={member.name} className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <h3 className="font-semibold text-xl mb-2">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
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
          <div className="relative w-full overflow-hidden">
            <div className="flex slide">
              {[...galleryImages, ...galleryImages].map((image, index) => (
                <div key={index} className="flex-shrink-0 w-1/4 px-2">
                  <img
                    src={image}
                    alt={`Imagem da galeria ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
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
