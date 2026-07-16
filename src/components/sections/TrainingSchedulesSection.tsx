import { motion } from 'framer-motion';
import { trainingSchedules } from '@/data/siteData';

export const TrainingSchedulesSection = () => (
  <section id="training" className="py-20 bg-gray-50 dark:bg-gray-950">
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
        02 — Formação
      </p>
      <h2 className="font-heading text-5xl md:text-6xl uppercase leading-none mb-10 text-gray-900 dark:text-white">
        Horários de <span className="text-primary">Treinos</span>
      </h2>

      <div className="grid sm:grid-cols-3 gap-px bg-primary/20 border border-primary/20">
        {trainingSchedules.map((schedule, i) => (
          <motion.div
            key={schedule.type}
            initial={{ opacity: 0, y: 24, rotateX: 4 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, scale: 1.01, rotateY: 1.5 }}
            style={{ transformPerspective: 600 }}
            className="relative p-8 bg-white dark:bg-gray-950 hover:bg-primary/5 dark:hover:bg-primary/5 overflow-hidden group cursor-default"
          >
            <span
              className="absolute right-2 bottom-2 font-heading font-black text-primary/10 dark:text-primary/5 select-none leading-none"
              style={{ fontSize: '6rem' }}
            >
              U{schedule.type.replace('Sub ', '')}
            </span>
            <h3 className="relative z-10 font-heading text-2xl uppercase text-primary mb-5 tracking-wide">{schedule.type}</h3>
            <div className="relative z-10 space-y-2">
              {schedule.sessions.map(s => (
                <div
                  key={s.day}
                  className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5 last:border-0"
                >
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{s.day}</span>
                  <span className="font-mono text-sm text-primary">{s.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </section>
);
