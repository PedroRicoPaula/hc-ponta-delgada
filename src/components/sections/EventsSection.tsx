import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { senioresEvents, formacaoEvents } from '@/data/siteData';

  const sectionRight = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

export const EventsSection = () => {
return (
<motion.section
        id="events"
        className="py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionRight}
      >
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
      </motion.section>
    );
}