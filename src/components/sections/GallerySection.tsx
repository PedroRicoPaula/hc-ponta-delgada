import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { galleryImages } from '@/data/siteData';
import { useState, useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';

export const GallerySection = () => {
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  ).current;

  return (
    <section id="gallery" className="py-20 bg-gray-100 dark:bg-gray-950 overflow-hidden">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 40, rotateX: 3 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformPerspective: 1200 }}
      >
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/70 mb-3">
          <span className="w-5 h-px bg-primary/50" />
          05 — Momentos
        </p>
        <h2 className="font-heading text-5xl md:text-6xl uppercase leading-none mb-4 text-gray-900 dark:text-white">
          Galeria <span className="text-primary">HCPDL</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
          {isAutoplayPaused ? 'Clique para retomar' : 'Clique para pausar'} · Arrasta para ver mais
        </p>

        <Carousel
          className="w-full max-w-4xl mx-auto cursor-pointer"
          plugins={[autoplayPlugin]}
          opts={{ align: 'start', loop: true, dragFree: true }}
          onClick={() => {
            if (isAutoplayPaused) { autoplayPlugin.play(); } else { autoplayPlugin.stop(); }
            setIsAutoplayPaused(!isAutoplayPaused);
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {galleryImages.map((image, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                <motion.div
                  className="border border-primary/15 overflow-hidden"
                  whileHover={{ scale: 1.02, rotateY: 2 }}
                  style={{ transformPerspective: 600 }}
                >
                  <Dialog>
                    <VisuallyHidden><DialogTitle>Imagem da Galeria</DialogTitle></VisuallyHidden>
                    <DialogTrigger asChild>
                      <img
                        src={image}
                        alt={`HCPDL momento ${index + 1}`}
                        className="w-full h-56 object-contain bg-black hover:scale-105 transition-transform duration-300 cursor-pointer grayscale hover:grayscale-0"
                        loading="lazy"
                      />
                    </DialogTrigger>
                    <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-0 bg-black/95 flex items-center justify-center [&>button]:absolute [&>button]:right-3 [&>button]:top-3 [&>button]:bg-black/50 [&>button]:text-white [&>button]:rounded-full [&>button]:p-2">
                      <img
                        src={image}
                        alt={`HCPDL momento ${index + 1}`}
                        className="max-w-full max-h-[85vh] object-contain"
                        loading="lazy"
                      />
                    </DialogContent>
                  </Dialog>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-2 gap-px">
            <CarouselPrevious className="relative static translate-y-0 rounded-none bg-primary/10 border-primary/20 hover:bg-primary hover:text-black text-gray-900 dark:text-white" />
            <CarouselNext className="relative static translate-y-0 rounded-none bg-primary/10 border-primary/20 hover:bg-primary hover:text-black text-gray-900 dark:text-white" />
          </div>
        </Carousel>
      </motion.div>
    </section>
  );
};
