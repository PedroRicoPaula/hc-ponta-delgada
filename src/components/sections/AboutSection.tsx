import { motion } from 'framer-motion';

const sectionVariants = {
  hidden: { opacity: 0, y: 40, rotateX: 3 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } }
};

const features = [
  { icon: '🏠', title: 'Pavilhão Sidório Serpa', desc: 'A nossa casa. O palco das vitórias em Ponta Delgada.' },
  { icon: '🌊', title: 'Orgulho Açoriano', desc: 'Representamos os Açores nos campeonatos nacionais.' },
  { icon: '🎯', title: 'Formação', desc: 'Escolinhas, Sub 11, 13, 17 — o futuro do hóquei.' },
];

export const AboutSection = () => (
  <motion.section
    id="about"
    className="py-20 bg-white dark:bg-gray-900"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.15 }}
    variants={sectionVariants}
    style={{ transformPerspective: 1200 }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/70 mb-3">
        <span className="w-5 h-px bg-primary/50" />
        01 — Sobre Nós
      </p>
      <h2 className="font-heading text-5xl md:text-6xl uppercase leading-none mb-12 text-gray-900 dark:text-white">
        Uma história de <span className="text-primary">paixão</span>
      </h2>

      <div className="grid md:grid-cols-2 gap-14">
        <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg leading-relaxed">
          Fundado em 2012, o Hóquei Clube PDL é um símbolo de excelência desportiva nos Açores.
          O nosso compromisso com o desenvolvimento de jovens talentos e a promoção do hóquei na região tornou-nos
          um dos clubes mais respeitados em Portugal.
        </p>
        <div className="space-y-2">
          {features.map(({ icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ x: 4, rotateY: 1, scale: 1.01 }}
              style={{ transformPerspective: 600 }}
              className="flex items-start gap-4 p-4 bg-gray-100 dark:bg-gray-800 group cursor-default"
            >
              <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
              <div>
                <h4 className="font-heading text-base uppercase tracking-wide text-gray-900 dark:text-white font-black">{title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </motion.section>
);
