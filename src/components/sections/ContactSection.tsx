import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const MAPS_PAVILHAO = "https://www.google.com/maps/place/Pavilhão+Sidónio+Serpa/@37.7408,-25.6727,17z";
const MAPS_SEDE = "https://www.google.com/maps/search/?api=1&query=Rua+Vítor+Câmara+Bloco+1+R/C+Drt,+9500-234+Ponta+Delgada";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "SportsOrganization"],
  "@id": "https://hoqueiclubepdl.com/#organization",
  "name": "Hóquei Clube PDL",
  "alternateName": ["HCPDL", "HC PDL"],
  "description": "Clube de hóquei em patins fundado em 2012 em Ponta Delgada, Açores. Escalões de formação Sub-11, Sub-13, Sub-17 e equipa sénior.",
  "url": "https://hoqueiclubepdl.com/",
  "telephone": "+351296382987",
  "email": "hoquei.clube.pdl@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "R. Vítor Câmara Bloco 1 R/C Drt",
    "addressLocality": "Ponta Delgada",
    "postalCode": "9500-234",
    "addressRegion": "Açores",
    "addressCountry": "PT"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 37.7408,
    "longitude": -25.6727
  },
  "hasMap": "https://www.google.com/maps/place/Pavilhão+Sidório+Serpa/@37.7408,-25.6727,17z",
  "logo": "https://hoqueiclubepdl.com/uploads/pdlLogo.png",
  "image": "https://hoqueiclubepdl.com/uploads/PDL24-25V2.png",
  "foundingDate": "2012",
  "taxID": "510378242",
  "sameAs": [
    "https://www.facebook.com/HoqueiClubePDL",
    "https://www.instagram.com/hoqueiclubepdl/",
    "https://www.youtube.com/@HoqueiClubePDL"
  ]
};

export const ContactSection = () => (
  <section id="contact" className="py-20 bg-white dark:bg-gray-950">
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
    </Helmet>
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
        07 — Contactos
      </p>
      <h2 className="font-heading text-5xl md:text-6xl uppercase leading-none mb-12 text-gray-900 dark:text-white">
        Fala <span className="text-primary">Connosco</span>
      </h2>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact info */}
        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-1">Email</p>
            <a
              href="mailto:hoquei.clube.pdl@gmail.com"
              className="text-gray-900 dark:text-white hover:text-primary transition-colors duration-150"
            >
              hoquei.clube.pdl@gmail.com
            </a>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-1">Telefone</p>
            <a
              href="tel:+351296382987"
              className="text-gray-900 dark:text-white hover:text-primary transition-colors duration-150"
            >
              +351 296 382 987
            </a>
          </div>

          <img
            src="/uploads/PavilhaoSidonioSerpa.jpg"
            alt="Pavilhão Sidório Serpa"
            className="w-full h-72 object-cover border border-primary/20"
            loading="lazy"
          />
        </div>

        {/* Address cards */}
        <div className="space-y-4">
          <motion.div
            whileHover={{ y: -3, scale: 1.01, rotateY: 1 }}
            style={{ transformPerspective: 600 }}
            className="relative bg-gray-50 dark:bg-primary/5 border border-gray-200 dark:border-primary/15 p-6 overflow-hidden group hover:border-primary/40"
          >
            <span className="absolute right-2 bottom-2 text-6xl opacity-5 select-none">🏢</span>
            <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-3">Sede do Clube</p>
            <h3 className="font-heading text-xl uppercase text-gray-900 dark:text-white font-black mb-2">HC PDL</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              R. Vítor Câmara Bloco 1 R/C Drt<br />
              9500-234 Ponta Delgada, Açores
            </p>
            <a
              href={MAPS_SEDE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-primary text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 hover:bg-primary hover:text-gray-950"
            >
              Google Maps ↗
            </a>
          </motion.div>

          <motion.div
            whileHover={{ y: -3, scale: 1.01, rotateY: 1 }}
            style={{ transformPerspective: 600 }}
            className="relative bg-gray-50 dark:bg-primary/5 border border-gray-200 dark:border-primary/15 p-6 overflow-hidden group hover:border-primary/40"
          >
            <span className="absolute right-2 bottom-2 text-6xl opacity-5 select-none">🏟️</span>
            <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-3">Treinos & Jogos</p>
            <h3 className="font-heading text-xl uppercase text-gray-900 dark:text-white font-black mb-2">Pavilhão Sidório Serpa</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              Rua do Contador<br />
              9500 Ponta Delgada, Açores
            </p>
            <a
              href={MAPS_PAVILHAO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-primary text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 hover:bg-primary hover:text-gray-950"
            >
              Google Maps ↗
            </a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  </section>
);
