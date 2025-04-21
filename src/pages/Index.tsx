
import { Navigation } from "@/components/Navigation";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Card } from "@/components/ui/card";

const teamMembers = [
  { name: "João Silva", position: "Forward", number: "10" },
  { name: "Miguel Santos", position: "Defense", number: "5" },
  { name: "Pedro Costa", position: "Goalkeeper", number: "1" },
  { name: "António Oliveira", position: "Forward", number: "7" },
  { name: "Manuel Pereira", position: "Defense", number: "3" },
];

const staff = [
  { name: "Carlos Rodriguez", role: "Head Coach" },
  { name: "José Fernandes", role: "Assistant Coach" },
  { name: "Maria Sousa", role: "Physical Therapist" },
];

const events = [
  {
    title: "PDL vs Sporting CP",
    date: "2025-05-01",
    time: "20:00",
    location: "Pavilhão Municipal",
  },
  {
    title: "PDL vs SL Benfica",
    date: "2025-05-15",
    time: "19:30",
    location: "Pavilhão Municipal",
  },
  {
    title: "FC Porto vs PDL",
    date: "2025-05-29",
    time: "21:00",
    location: "Dragão Arena",
  },
];

const galleryImages = [
  "/placeholder.svg",
  "/placeholder.svg",
  "/placeholder.svg",
  "/placeholder.svg",
  "/placeholder.svg",
];

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
            <p className="text-xl text-gray-600 mb-8">Passion, Pride, and Excellence since 2012</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
          <p className="text-gray-600 text-lg text-center max-w-3xl mx-auto">
            Founded in 2012, Hóquei Clube Ponta Delgada has been a symbol of sporting excellence in the Azores.
            Our commitment to developing young talent and promoting hockey in the region has made us one of the
            most respected clubs in Portugal.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          
          <h3 className="text-2xl font-semibold mb-6">Players</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {teamMembers.map((member) => (
              <Card key={member.name} className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">{member.number}</span>
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{member.name}</h3>
                  <p className="text-gray-600">{member.position}</p>
                </div>
              </Card>
            ))}
          </div>

          <h3 className="text-2xl font-semibold mb-6">Staff</h3>
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
          <h2 className="text-3xl font-bold text-center mb-12">Gallery</h2>
          <div className="relative w-full overflow-hidden">
            <div className="flex slide">
              {[...galleryImages, ...galleryImages].map((image, index) => (
                <div key={index} className="flex-shrink-0 w-1/4 px-2">
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
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
          <h2 className="text-3xl font-bold text-center mb-12">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.title} className="p-6 hover:shadow-lg transition-shadow">
                <div>
                  <h3 className="font-semibold text-xl mb-2">{event.title}</h3>
                  <p className="text-gray-600">Date: {event.date}</p>
                  <p className="text-gray-600">Time: {event.time}</p>
                  <p className="text-gray-600">Location: {event.location}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
          <div className="text-center">
            <p className="text-gray-600 mb-2">Email: info@hcpontadelgada.pt</p>
            <p className="text-gray-600 mb-2">Phone: +351 296 123 456</p>
            <p className="text-gray-600">Address: Rua do Hóquei, 9500-123 Ponta Delgada, Açores</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Hóquei Clube Ponta Delgada. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
