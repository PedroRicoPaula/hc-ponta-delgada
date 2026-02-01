import { motion } from 'framer-motion';

const sectionLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 2.0 }
  }
};
export const SponsorsSection = () => {
  return (
    <motion.section
      id="sponsors"
      className="py-16 bg-gray-100"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionLeft}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Patrocinadores</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {[
            { name: "Azemad", logo: "/uploads/AzemadLogo.jpg", url: "https://azemad.com/" },
            { name: "Auto Cordeiro", logo: "/uploads/AutoCordeiroLogo1.png", url: "https://autocordeiro.com" },
            { name: "Crenku", logo: "/uploads/CrenkuLogo.png", url: "https://www.facebook.com/engenhososdesafios/?locale=pt_PT" },
            { name: "Catchawards", logo: "/uploads/catchawards.png", url: "https://www.catchawardsportugal.pt/" },
            { name: "Agência Funerária Lindo", logo: "/uploads/FunerariaLindoLogo.jpg", url: "https://www.facebook.com/funerarialindo/?locale=pt_PT" },
          ].map((sponsor) => (
            <a
              key={sponsor.name}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-4 hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-md"
            >
              {/* Logo container ensures uniform size */}
              <div className="h-20 w-40 flex items-center justify-center">
                <img
                  src={sponsor.logo}
                  alt={`Logótipo do patrocinador ${sponsor.name}`}
                  className="max-h-full max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
              </div>
              <span className="text-gray-700 font-medium text-center mt-3">{sponsor.name}</span>
            </a>
          ))}
        </div>
      </div>
    </motion.section>
  );
}