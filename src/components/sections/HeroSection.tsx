import { motion } from 'framer-motion';

const sectionFade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 2.0 }
  }
};

export const HeroSection = () => (
  <motion.header
    className="pt-20 pb-12 bg-gradient-to-b from-primary/20 to-transparent"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    variants={sectionFade}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Hóquei Clube Ponta Delgada
        </h1>
        <p className="text-xl text-gray-600 mb-8">Paixão, Orgulho e Excelência desde 2012</p>
        <img
          src="/lovable-uploads/PDL24-25V2.png"
          alt="Equipa sénior do Hóquei Clube Ponta Delgada para a época 2025-2026"
          className="mx-auto h-auto object-contain rounded-lg shadow-lg max-w-full md:max-w-[480px]"
          width="1000"
          height="667"
        />
      </div>
    </div>
  </motion.header>
);