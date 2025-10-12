import { motion } from 'framer-motion';

const sectionVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 2.0 }
    }
};

export const AboutSection = () => (
  <motion.section
    id="about"
    className="py-16"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    variants={sectionVariants}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-8">Sobre Nós</h2>
      <p className="text-gray-600 text-lg text-center max-w-3xl mx-auto">
        Fundado em 2012, o Hóquei Clube de Ponta Delgada tem sido um símbolo de excelência desportiva nos Açores.
        O nosso compromisso com o desenvolvimento de jovens talentos e a promoção do hóquei na região tornou-nos
        um dos clubes mais respeitados em Portugal.
      </p>
    </div>
  </motion.section>
);