import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { galleryImages } from '@/data/siteData';
import { useState, useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';

const sectionFade = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 2.0 }
    }
  };

export const GallerySection = () => {
const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
const autoplayPlugin = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  ).current;

const handleCarouselClick = () => {
    if (isAutoplayPaused) {
      autoplayPlugin.play();
    } else {
      autoplayPlugin.stop();
    }
    setIsAutoplayPaused(!isAutoplayPaused);
  };
return (
      <motion.section
        id="gallery"
        className="py-16 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionFade}
      >
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
                  <div className="p-2 bg-white/5 rounded-lg">
                    <Dialog>
                      <VisuallyHidden>
                        <DialogTitle>Imagem da Galeria Ampliada</DialogTitle>
                      </VisuallyHidden>
                      <DialogTrigger asChild>
                        <img 
                          src={image} 
                          alt={`Hóquei Clube Ponta Delgada - Momento ${index + 1} dos nossos treinos e jogos`} 
                          className="w-full h-64 object-contain rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
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
      </motion.section>
  );
}