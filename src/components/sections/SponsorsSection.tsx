import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';
import { sponsors, type Sponsor } from '@/data/siteData';
import { Link } from 'react-router-dom';

function SponsorLink({ sponsor, className, children }: { sponsor: Sponsor; className: string; children: React.ReactNode }) {
  if (!sponsor.url) {
    return <div className={className}>{children}</div>;
  }
  return (
    <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className={`group ${className}`}>
      {children}
    </a>
  );
}

function SponsorLogo({ sponsor, className }: { sponsor: Sponsor; className: string }) {
  return (
    <div className={`h-full w-full flex items-center justify-center${sponsor.lightPlate ? ' dark:bg-white dark:rounded-md dark:p-1' : ''}`}>
      <img
        src={sponsor.logo}
        alt={`Patrocinador ${sponsor.name}`}
        className={`${className}${sponsor.lightPlate ? ' dark:grayscale-0 dark:opacity-100' : ' dark:brightness-200'}`}
        loading="lazy"
      />
    </div>
  );
}

export const SponsorsSection = () => {
  const autoplay = useRef(Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true }));
  const featured = sponsors.find((s) => s.featured);
  const others = sponsors.filter((s) => !s.featured);
  const duplicatedOthers = [...others, ...others, ...others, ...others];
  const tickerOthers = [...others, ...others]; // exactamente 2x — o keyframe "ticker" percorre -50%, um ciclo completo

  return (
    <motion.section
      id="sponsors"
      className="py-20 bg-white dark:bg-gray-900 overflow-hidden"
      initial={{ opacity: 0, y: 40, rotateX: 3 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 1200 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/70 mb-3">
          <span className="w-5 h-px bg-primary/50" />
          06 — Parceiros
        </p>
        <h2 className="font-heading text-5xl md:text-6xl uppercase leading-none mb-10 text-gray-900 dark:text-white">
          Patrocinadores
        </h2>

        {/* Featured sponsor */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-10"
          >
            <SponsorLink sponsor={featured} className="flex items-center justify-center p-4 transition-all duration-300">
              <div className="h-24 w-44 sm:h-32 sm:w-60 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                <SponsorLogo
                  sponsor={featured}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </SponsorLink>
          </motion.div>
        )}

        {/* Others — desktop ticker, direita→esquerda, pausa no hover */}
        <div className="hidden md:block overflow-hidden">
          <div className="flex w-max items-center gap-10 lg:gap-14 animate-ticker hover:[animation-play-state:paused]">
            {tickerOthers.map((sponsor, index) => (
              <SponsorLink
                key={`${sponsor.name}-${index}`}
                sponsor={sponsor}
                className="flex flex-shrink-0 items-center justify-center p-4 transition-all duration-300"
              >
                <div className="h-16 w-28 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <SponsorLogo
                    sponsor={sponsor}
                    className="max-h-full max-w-full object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-400"
                  />
                </div>
              </SponsorLink>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex justify-center mt-10 mb-2"
        >
          <Link
            to="/patrocinadores"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-gray-950 px-6 py-3 font-heading font-black text-sm uppercase tracking-widest transition-all duration-200"
          >
            Quero ser Patrocinador
          </Link>
        </motion.div>

        {/* Others — mobile carousel, smaller */}
        <div className="md:hidden mt-4">
          <Carousel opts={{ align: 'start', loop: true, dragFree: true }} plugins={[autoplay.current]} className="w-full">
            <CarouselContent className="-ml-4 flex items-center">
              {duplicatedOthers.map((sponsor, index) => (
                <CarouselItem key={index} className="pl-4 basis-1/3">
                  <SponsorLink sponsor={sponsor} className="flex items-center justify-center p-2">
                    <div className="h-14 w-24 flex items-center justify-center">
                      <SponsorLogo
                        sponsor={sponsor}
                        className="max-h-full max-w-full object-contain grayscale opacity-50 active:grayscale-0 active:opacity-100 transition-all"
                      />
                    </div>
                  </SponsorLink>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </motion.section>
  );
};
