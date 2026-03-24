import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';
import { sponsors } from '@/data/siteData';
import { Link } from 'react-router-dom';
const sectionLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 2.0 }
  }
};
export const SponsorsSection = () => {
  const autoplay = useRef(
    Autoplay({
      delay: 2000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  // Desejamos uma lista longa para que o loop seja fluido no Embla
  const duplicatedSponsors = [...sponsors, ...sponsors, ...sponsors, ...sponsors];

  return (
    <motion.section
      id="sponsors"
      className="py-16 bg-gray-50 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionLeft}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Patrocinadores</h2>

        {/* Vista Desktop: Estática em linha */}
        <div className="hidden md:flex flex-wrap items-center justify-center gap-4 lg:gap-8">
          {sponsors.map((sponsor) => (
            <a
              key={sponsor.name}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center p-4 transition-all duration-300"
            >
              <div className="h-20 w-32 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <img
                  src={sponsor.logo}
                  alt={`Logótipo do patrocinador ${sponsor.name}`}
                  className="max-h-full max-w-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  loading="lazy"
                />
              </div>
            </a>
          ))}
        </div>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="flex justify-center mt-12 mb-2"
        >
          <Link
            to="/patrocinadores"
            onClick={() => window.scrollTo(0, 0)}
            className="group relative inline-flex items-center overflow-hidden border border-transparent hover:border-2 hover:border-gray-950 px-7 py-4 rounded-2xl font-semibold transition-colors duration-300 shadow-[0_0_20px_4px_rgba(0,0,0,0.10),0_4px_16px_rgba(0,0,0,0.10)]"
          >
            <span className="absolute inset-0 bg-primary translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-right" />
            <span className="relative z-10 text-primary group-hover:text-gray-950 transition-colors duration-300">
              Quero ser Patrocinador
            </span>
          </Link>
        </motion.div>

        {/* Vista Mobile: Carrossel Animado */}
        <div className="md:hidden">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
            }}
            plugins={[autoplay.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-4 flex items-center">
              {duplicatedSponsors.map((sponsor, index) => (
                <CarouselItem key={index} className="pl-4 basis-1/2">
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-4"
                  >
                    <div className="h-20 w-32 flex items-center justify-center">
                      <img
                        src={sponsor.logo}
                        alt={`Logótipo do patrocinador ${sponsor.name}`}
                        className="max-h-full max-w-full object-contain grayscale opacity-60 active:grayscale-0 active:opacity-100 transition-all duration-500"
                        loading="lazy"
                      />
                    </div>
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </motion.section>
  );
}