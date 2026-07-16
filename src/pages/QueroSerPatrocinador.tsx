import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import {
  Eye, TrendingUp, BadgePercent, Users,
  Star, Package, ArrowRight, Check, ChevronDown,
  Shirt, MapPin, Megaphone, Trophy, Heart, House, Apple, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const steps = 60;
    const increment = target / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 2000 / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const easing = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easing, delay }
  })
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const formationZones = [
  { zone: 'Zona 1', location: 'Ombro Esquerdo', price: 100, description: 'Visibilidade no ombro esquerdo da camisola' },
  { zone: 'Zona 2', location: 'Ombro Direito', price: 100, description: 'Visibilidade no ombro direito da camisola' },
  { zone: 'Zona 3', location: 'Peito — Principal', price: 300, description: 'Posição premium no centro do peito', highlight: true },
  { zone: 'Zona 4', location: 'Calções', price: 100, description: 'Visibilidade nos calções dos atletas' },
  { zone: 'Zona 5', location: 'Costas Inferior', price: 200, description: 'Área inferior das costas da camisola' },
  { zone: 'Zona 6', location: 'Trás Calções', price: 100, description: 'Parte traseira dos calções dos atletas' },
];

const seniorZones = [
  { zone: 'Zona 1', location: 'Ombro Esquerdo', price: 350, description: 'Visibilidade no ombro esquerdo da camisola' },
  { zone: 'Zona 2', location: 'Ombro Direito', price: 350, description: 'Visibilidade no ombro direito da camisola' },
  { zone: 'Zona 3', location: 'Peito — Principal', price: 1250, description: 'Posição premium — visível em todos os jogos transmitidos', highlight: true },
  { zone: 'Zona 4', location: 'Calções', price: 400, description: 'Visibilidade nos calções dos atletas' },
  { zone: 'Zona 5', location: 'Costas Inferior', price: 600, description: 'Área inferior das costas da camisola' },
  { zone: 'Zona 6', location: 'Trás Calções', price: 400, description: 'Parte traseira dos calções dos atletas' },
];

export default function QueroSerPatrocinador() {
  const [activeTab, setActiveTab] = useState<'formacao' | 'senior'>('senior');
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  const zones = activeTab === 'formacao' ? formationZones : seniorZones;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden">
      <Helmet>
        <title>Quero ser Patrocinador | Hóquei Clube PDL</title>
        <meta
          name="description"
          content="Torne-se parceiro do Hóquei Clube PDL. Visibilidade para a sua marca, impacto social e benefícios fiscais reais. Época 2026/2027."
        />
        <link rel="canonical" href="https://hoqueiclubepdl.com/patrocinadores" />
        <meta property="og:title" content="Quero ser Patrocinador | Hóquei Clube PDL" />
        <meta property="og:description" content="Torne-se parceiro do Hóquei Clube PDL. Visibilidade para a sua marca, impacto social e benefícios fiscais reais. Época 2026/2027." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hoqueiclubepdl.com/patrocinadores" />
      </Helmet>

      <Navigation />

      {/* ─── HERO — always dark (background photo) ─────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/uploads/TorneioCidadeRG_PDL_Campeao_Sub13_Sub17.jpeg"
            alt="Hóquei em Patins — HC PDL"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/75 via-gray-950/85 to-gray-950" />
        </div>

        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary blur-[140px] z-0 pointer-events-none"
        />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20 pb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: easing }}
            className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 text-primary text-sm font-semibold mb-6"
          >
            <Star className="w-4 h-4" />
            Época 2026 / 2027
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: easing }}
            className="text-4xl sm:text-6xl md:text-7xl font-black mb-4 leading-tight tracking-tight text-white"
          >
            Seja Parceiro do{' '}
            <span className="text-primary relative inline-block">
              HC PDL
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.9, ease: easing }}
                className="absolute -bottom-1 left-0 right-0 h-1 bg-primary origin-left rounded-full"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Invista no hóquei em patins dos Açores. Visibilidade para a sua marca,
            impacto real na comunidade e benefícios fiscais garantidos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <a
              href="#pacotes"
              className="group inline-flex items-center justify-center gap-2 bg-primary text-gray-950 hover:bg-primary/90 font-heading font-black text-sm sm:text-base uppercase tracking-wider px-7 sm:px-8 py-4 sm:py-5 shadow-lg shadow-primary/20 w-full sm:w-auto transition-colors"
            >
              Ver Pacotes
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <button
              onClick={() => setShowWhatsApp(true)}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-gray-950 font-heading font-black text-sm sm:text-base uppercase tracking-wider px-7 sm:px-8 py-4 sm:py-5 w-full sm:w-auto transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Falar Connosco
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
          onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
            <ChevronDown className="w-8 h-8 text-primary/60" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── STATS ─────────────────────────────────────────────────── */}
      <section id="stats" className="py-6 md:py-16 bg-gray-50 dark:bg-gray-900 border-y border-gray-200 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            {[
              { value: 60, suffix: '+', label: 'Espectadores/jogo', icon: Users },
              { value: 2012, suffix: '', label: 'Ano de Fundação', icon: Trophy, noAnimate: true },
              { value: 4, suffix: '', label: 'Escalões de Formação', icon: Star },
              { value: 14, suffix: '', label: 'Anos de Hóquei', icon: Heart },
            ].map(({ value, suffix, label, icon: Icon, noAnimate = false }) => (
              <motion.div key={label} variants={fadeUp}>
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-black text-primary mb-1">
                  {noAnimate ? <span>{value}{suffix}</span> : <AnimatedCounter target={value} suffix={suffix} />}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── QUEM É O HC PDL ───────────────────────────────────────── */}
      <section className="py-8 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="text-primary text-sm font-semibold uppercase tracking-widest">Sobre o Clube</span>
              <h2 className="text-3xl md:text-5xl font-black mt-2 mb-4 leading-tight text-gray-900 dark:text-white">
                Quem é o<br />
                <span className="text-primary">H.C. PDL?</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed mb-3">
                Fundado em 2012 na sequência do encerramento da modalidade de hóquei em patins noutro clube,
                o HC PDL nasceu da vontade de atletas e dirigentes que recusaram deixar morrer o desporto na ilha.
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed mb-3">
                Com foco exclusivo no hóquei em patins, o clube tem dado continuidade à formação de jovens
                atletas e mantido viva a modalidade em São Miguel e nos Açores.
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
                Desde a sua fundação, o HC PDL depende do apoio de entidades parceiras para continuar
                a crescer e a competir a nível nacional.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: easing }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10">
                <img
                  src="/uploads/PDL24-25V2.png"
                  alt="Hóquei Clube PDL"
                  className="w-full h-56 md:h-80 object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary text-gray-950 rounded-xl p-4 font-black text-sm shadow-xl">
                <div className="text-2xl">NIPC</div>
                <div>510 378 242</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 3 PILLARS ─────────────────────────────────────────────── */}
      <section className="py-8 md:py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-6 md:mb-14"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Porquê investir</span>
            <h2 className="text-3xl md:text-5xl font-black mt-2 mb-3 text-gray-900 dark:text-white">Razões para ser parceiro</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-lg max-w-xl mx-auto">
              Três pilares que tornam esta parceria vantajosa para qualquer empresa ou particular.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid md:grid-cols-3 gap-4 md:gap-8"
          >
            {[
              {
                icon: Eye,
                title: 'Visibilidade',
                gradient: 'from-yellow-500/15 to-yellow-600/0',
                border: 'border-yellow-500/20',
                iconBg: 'bg-yellow-500/15',
                iconColor: 'text-yellow-500 dark:text-yellow-400',
                checkColor: 'text-yellow-500 dark:text-yellow-400',
                description: 'A sua marca em destaque nos jogos, nas transmissões ao vivo e em todas as comunicações do clube.',
                points: [
                  'Jogos transmitidos no YouTube',
                  'Resumos na RTP Açores',
                  'Website e redes sociais',
                  'Pavilhão nos dias de jogo',
                ],
                img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&q=80',
              },
              {
                icon: TrendingUp,
                title: 'Impacto',
                gradient: 'from-blue-500/15 to-blue-600/0',
                border: 'border-blue-500/20',
                iconBg: 'bg-blue-500/15',
                iconColor: 'text-blue-500 dark:text-blue-400',
                checkColor: 'text-blue-500 dark:text-blue-400',
                description: 'O seu investimento transforma-se diretamente em melhores condições para atletas e treinadores.',
                points: [
                  'Apoio à formação jovem',
                  'Melhores condições de treino',
                  'Inclusão social pelo desporto',
                  'Desenvolvimento regional',
                ],
                img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&q=80',
              },
              {
                icon: BadgePercent,
                title: 'Benefícios Fiscais',
                gradient: 'from-green-500/15 to-green-600/0',
                border: 'border-green-500/20',
                iconBg: 'bg-green-500/15',
                iconColor: 'text-green-600 dark:text-green-400',
                checkColor: 'text-green-600 dark:text-green-400',
                description: 'Como Instituição de Utilidade Pública Desportiva, os donativos beneficiam de deduções fiscais.',
                points: [
                  'Majoração até 120% (IRC)',
                  'Dedução 25% em IRS',
                  'Recibo oficial emitido',
                  'Mecenato desportivo legal',
                ],
                img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&q=80',
              },
            ].map(({ icon: Icon, title, gradient, border, iconBg, iconColor, checkColor, description, points, img }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -10, transition: { duration: 0.35 } }}
                className={cn(
                  'relative rounded-2xl border bg-gradient-to-b overflow-hidden group cursor-default',
                  gradient,
                  border
                )}
              >
                <div className="relative h-44 overflow-hidden hidden md:block">
                  <img
                    src={img}
                    alt={title}
                    className="w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-950/95" />
                  <div className={cn('absolute bottom-4 left-4 w-11 h-11 rounded-xl flex items-center justify-center border border-white/10', iconBg)}>
                    <Icon className={cn('w-5 h-5', iconColor)} />
                  </div>
                </div>
                <div className={cn('flex items-center gap-3 px-4 pt-4 md:hidden', iconBg)}>
                  <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center border border-white/10', iconBg)}>
                    <Icon className={cn('w-5 h-5', iconColor)} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="text-xl font-bold mb-2 hidden md:block text-gray-900 dark:text-white">{title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 md:mb-5 leading-relaxed">{description}</p>
                  <ul className="space-y-1.5">
                    {points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Check className={cn('w-4 h-4 flex-shrink-0', checkColor)} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── VISIBILITY CHANNELS ───────────────────────────────────── */}
      <section className="py-8 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-6 md:mb-14"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Alcance</span>
            <h2 className="text-3xl md:text-5xl font-black mt-2 mb-3 text-gray-900 dark:text-white">A sua marca em destaque</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-lg max-w-xl mx-auto">
              Múltiplos canais de visibilidade para maximizar o retorno do seu investimento.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6"
          >
            {[
              {
                img: '/uploads/PavilhaoSidonioSerpa.jpg',
                title: 'No Pavilhão',
                desc: 'Média de 60+ espectadores por jogo em casa, famílias e adeptos fiéis.',
              },
              {
                img: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&auto=format&q=80',
                title: 'YouTube',
                desc: 'Jogos da equipa sénior transmitidos ao vivo no canal @HoqueiClubePDL.',
              },
              {
                img: 'https://acores.rtp.pt/wp-content/uploads/2023/10/rtp-acores.png',
                title: 'RTP Açores',
                desc: 'Resumos dos jogos no programa "Teledesporto" da RTP Açores.',
              },
              {
                img: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&auto=format&q=80',
                title: 'Redes Sociais',
                desc: 'Logótipo em destaque no website e em todas as publicações do clube.',
              },
            ].map(({ img, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-white/5 group shadow-sm dark:shadow-none"
              >
                <div className="h-32 md:h-48 overflow-hidden">
                  <img
                    src={img}
                    alt={title}
                    className="w-full h-full object-cover opacity-80 dark:opacity-60 group-hover:opacity-100 dark:group-hover:opacity-80 group-hover:scale-110 transition-all duration-700"
                  />
                </div>
                <div className="p-3 md:p-5">
                  <h3 className="font-bold text-sm md:text-lg mb-1 text-gray-900 dark:text-white">{title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── PACKAGES ──────────────────────────────────────────────── */}
      <section id="pacotes" className="py-10 md:py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-6 md:mb-10"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Investimento</span>
            <h2 className="text-3xl md:text-5xl font-black mt-2 mb-3 text-gray-900 dark:text-white">Pacotes de Patrocínio</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-lg max-w-xl mx-auto">
              Escolha a zona de visibilidade no equipamento e o plantel que melhor se adapta à sua estratégia.
            </p>
          </motion.div>

          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-200 dark:bg-gray-800 rounded-xl p-1 border border-gray-300 dark:border-white/10">
              {(['senior', 'formacao'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300',
                    activeTab === tab
                      ? 'bg-primary text-gray-950 shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  {tab === 'senior' ? 'Plantel Sénior' : 'Formação'}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            key={activeTab + '-card'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easing }}
            className="max-w-3xl mx-auto bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-white/10 p-5 sm:p-6 space-y-4 shadow-sm dark:shadow-none"
          >
            <h3 className="text-base font-bold text-center text-gray-700 dark:text-gray-300">
              Mapa de Zonas — {activeTab === 'senior' ? 'Equipa Sénior' : 'Formação'}
            </h3>

            <div className="flex flex-col md:flex-row gap-4 items-stretch">
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-gray-900/50 md:w-5/12 flex-shrink-0">
                <img
                  src="/uploads/camisas_numeradas.PNG"
                  alt="Camisola com zonas de patrocínio"
                  className="w-full h-full object-contain max-h-64 md:max-h-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-2 md:flex-1 content-start">
                {zones.map(({ zone, location, price, description, highlight }, i) => (
                  <div
                    key={zone}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 rounded-xl border',
                      highlight
                        ? 'bg-primary/10 border-primary/40'
                        : 'bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-white/10'
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={cn(
                        'w-7 h-7 rounded-md flex items-center justify-center text-xs font-black flex-shrink-0',
                        highlight ? 'bg-primary text-gray-950' : 'bg-gray-500 dark:bg-gray-600 text-white'
                      )}>
                        {i + 1}
                      </div>
                      <div className="min-w-0">
                        <div className={cn(
                          'text-xs font-semibold truncate',
                          highlight ? 'text-primary' : 'text-gray-800 dark:text-gray-200'
                        )}>
                          {location}
                        </div>
                        <div className="text-xs text-gray-500 hidden md:block mt-0.5">{description}</div>
                      </div>
                    </div>
                    <span className={cn(
                      'text-sm font-black flex-shrink-0 ml-2',
                      highlight ? 'text-primary' : 'text-gray-900 dark:text-white'
                    )}>
                      {price.toLocaleString('pt-PT')}€
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={cn('grid gap-3', activeTab === 'senior' ? 'grid-cols-2' : 'grid-cols-1 max-w-xs mx-auto w-full')}>
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-gray-900/50">
                <img
                  src="/uploads/stick_logos.PNG"
                  alt="Sticks com logótipo"
                  className="w-full object-contain max-h-36"
                />
                <div className="px-3 py-2 text-center border-t border-gray-200 dark:border-white/10">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Autocolante nos Sticks</div>
                  <div className="text-sm font-black text-primary">{activeTab === 'senior' ? '300€' : '150€'}</div>
                </div>
              </div>
              {activeTab === 'senior' && (
                <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-gray-900/50">
                  <img
                    src="/uploads/caneleiras_grlogos.PNG"
                    alt="Caneleiras GR com logótipo"
                    className="w-full object-contain max-h-36"
                  />
                  <div className="px-3 py-2 text-center border-t border-gray-200 dark:border-white/10">
                    <div className="text-xs text-gray-600 dark:text-gray-400">Caneleiras G.R.</div>
                    <div className="text-sm font-black text-primary">300€</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── NAMING RIGHTS + BANNERS ───────────────────────────────── */}
      <section className="py-8 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-6 md:mb-12"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Destaque Máximo</span>
            <h2 className="text-3xl md:text-5xl font-black mt-2 mb-3 text-gray-900 dark:text-white">Pacotes Especiais</h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-2 gap-4 md:gap-8"
          >
            {/* Naming Rights */}
            <motion.div
              variants={fadeUp}
              whileHover={{ y: -8, transition: { duration: 0.35 } }}
              className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 to-primary/5 p-5 md:p-8"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"
              />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5">
                  <Star className="w-3.5 h-3.5" />
                  Patrocínio Premium
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-2 md:mb-3 text-gray-900 dark:text-white">Naming Rights</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 md:mb-6">
                  Associe o nome da sua empresa ao clube. O HC PDL passa a ser identificado com a sua
                  marca em todas as comunicações, comunicados e presença digital.
                </p>
                <div className="text-4xl md:text-5xl font-black text-primary mb-1">2.000€</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-6">por época / anual</div>
                <ul className="space-y-2">
                  {[
                    'Nome da marca associado ao clube',
                    'Todos os canais de comunicação',
                    'Website, redes sociais e imprensa',
                    'Máxima visibilidade de marca',
                  ].map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Banners */}
            <motion.div
              variants={fadeUp}
              whileHover={{ y: -8, transition: { duration: 0.35 } }}
              className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-gray-800/50 p-5 md:p-8 overflow-hidden relative"
            >
              <div className="absolute inset-0 z-0">
                <img
                  src="/uploads/pavilhao_lonas.PNG"
                  alt="Pavilhão com lonas publicitárias"
                  className="w-full h-full object-cover opacity-10 dark:opacity-20"
                />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5">
                  <MapPin className="w-3.5 h-3.5" />
                  No Pavilhão
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-2 md:mb-3 text-gray-900 dark:text-white">Lonas Publicitárias</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 md:mb-6">
                  O seu logótipo exibido em lonas no pavilhão durante todos os jogos em casa da
                  equipa sénior, visíveis por adeptos e nas transmissões YouTube.
                </p>
                <div className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-1">250€</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-6">por lona / época</div>
                <ul className="space-y-2">
                  {[
                    'Visível em todos os jogos em casa',
                    'Aparece nas transmissões YouTube',
                    'Alta visibilidade no pavilhão',
                  ].map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Check className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── OTHER CONTRIBUTIONS ───────────────────────────────────── */}
      <section className="py-8 md:py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-6 md:mb-14"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Flexibilidade</span>
            <h2 className="text-3xl md:text-5xl font-black mt-2 mb-3 text-gray-900 dark:text-white">Outras Formas de Contribuir</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-lg max-w-xl mx-auto">
              O apoio não tem de ser apenas monetário — há múltiplas formas de fazer a diferença.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
          >
            {[
              { icon: Shirt, title: 'Material Têxtil', desc: 'Equipamentos e material desportivo para treinos e competições dos atletas.', color: 'text-yellow-500 dark:text-yellow-400', bg: 'bg-yellow-500/10' },
              { icon: Apple, title: 'Alimentação & Bebidas', desc: 'Vouchers ou fornecimento direto para atletas e equipa técnica em dias de jogo.', color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-500/10' },
              { icon: Package, title: 'Material Técnico', desc: 'Material de primeiros socorros, cones, bolas e equipamento de treino.', color: 'text-red-500 dark:text-red-400', bg: 'bg-red-500/10' },
              { icon: House, title: 'Apoio em Residência', desc: 'Contribuição no pagamento de renda para atletas vindos de Portugal Continental.', color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/10' },
              { icon: Megaphone, title: 'Vagas de Emprego', desc: 'Oportunidades de emprego para atletas provenientes do continente.', color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-500/10' },
              { icon: Star, title: 'Parceria Personalizada', desc: 'Contacte-nos e em conjunto encontramos a forma ideal de parceria para a sua empresa.', color: 'text-primary', bg: 'bg-primary/10' },
            ].map(({ icon: Icon, title, desc, color, bg }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                custom={i * 0.04}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-white/10 rounded-2xl p-4 md:p-6 hover:border-gray-300 dark:hover:border-white/20 group shadow-sm dark:shadow-none"
              >
                <div className={cn('w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300', bg)}>
                  <Icon className={cn('w-5 h-5 md:w-6 md:h-6', color)} />
                </div>
                <h3 className="font-bold text-sm md:text-lg mb-1 text-gray-900 dark:text-white">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed hidden sm:block">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── IMPACT ────────────────────────────────────────────────── */}
      <section className="py-8 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: easing }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden hidden md:block"
            >
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop&q=80"
                alt="Impacto"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-2xl font-black mb-1 text-white">Impacto Real</div>
                <div className="text-gray-300 text-sm">O seu investimento chega diretamente aos atletas.</div>
              </div>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeUp}>
                <span className="text-primary text-sm font-semibold uppercase tracking-widest">O seu contributo</span>
                <h2 className="text-3xl md:text-4xl font-black mt-2 mb-6 md:mb-8 text-gray-900 dark:text-white">O impacto do seu patrocínio</h2>
              </motion.div>

              {[
                {
                  title: 'Impacto Financeiro',
                  items: [
                    'Financiamento de equipamentos e material desportivo',
                    'Redução de despesas logísticas do clube',
                    'Melhoria das condições de treino',
                  ],
                  color: 'border-l-primary',
                },
                {
                  title: 'Desenvolvimento dos Atletas',
                  items: [
                    'Investimento em treinadores e acompanhamento técnico',
                    'Mais oportunidades de evolução desportiva',
                    'Acesso ao desporto competitivo de qualidade',
                  ],
                  color: 'border-l-blue-400',
                },
                {
                  title: 'Impacto Social',
                  items: [
                    'Promoção da inclusão social pelo desporto',
                    'Participação ativa de jovens na comunidade',
                    'Valores: disciplina, trabalho em equipa, responsabilidade',
                  ],
                  color: 'border-l-green-400',
                },
              ].map(({ title, items, color }) => (
                <motion.div key={title} variants={fadeUp} className={cn('border-l-4 pl-4 mb-4 md:mb-6', color)}>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{title}</h3>
                  <ul className="space-y-1">
                    {items.map((item) => (
                      <li key={item} className="text-gray-600 dark:text-gray-400 text-sm flex items-start gap-2">
                        <span className="text-gray-400 dark:text-gray-600 mt-1.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FISCAL BENEFITS ───────────────────────────────────────── */}
      <section className="py-8 md:py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-6 md:mb-14"
          >
            <span className="text-green-600 dark:text-green-400 text-sm font-semibold uppercase tracking-widest">Mecenato Desportivo</span>
            <h2 className="text-3xl md:text-5xl font-black mt-2 mb-3 text-gray-900 dark:text-white">Benefícios Fiscais</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-lg max-w-xl mx-auto">
              Como Instituição de Utilidade Pública Desportiva, os seus donativos têm benefícios fiscais reais e garantidos.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-2 gap-4 md:gap-8"
          >
            <motion.div
              variants={fadeUp}
              whileHover={{ y: -8, transition: { duration: 0.35 } }}
              className="rounded-2xl border border-green-500/20 bg-gradient-to-b from-green-500/10 to-transparent p-5 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">Para Empresas</h3>
              </div>
              <ul className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                {[
                  { label: 'Majoração fiscal até', value: '120%', desc: 'por cada donativo efetuado ao clube' },
                  { label: 'Benefícios para dedução de', value: 'IRC', desc: 'deduções diretas no imposto sobre rendimento' },
                  { label: 'Apoio em espécie', value: 'Têxtil / Alimentos', desc: 'adquiridos diretamente pela empresa como patrocínio' },
                ].map(({ label, value, desc }) => (
                  <li key={value} className="flex items-start gap-4 p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{label} </span>
                      <span className="font-bold text-green-600 dark:text-green-400">{value}</span>
                      <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={fadeUp}
              whileHover={{ y: -8, transition: { duration: 0.35 } }}
              className="rounded-2xl border border-blue-500/20 bg-gradient-to-b from-blue-500/10 to-transparent p-5 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">Para Particulares</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                Qualquer particular pode apoiar financeiramente o clube e beneficiar de deduções em IRS,
                até ao limite de 15% da coleta total.
              </p>

              <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl p-6 mb-6">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-5 font-semibold">
                  Exemplo de cálculo
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Doação', value: '200€', color: 'text-gray-900 dark:text-white' },
                    { label: 'Dedução IRS (25%)', value: '− 50€', color: 'text-blue-500 dark:text-blue-400' },
                    { label: 'Custo efetivo', value: '150€', color: 'text-2xl text-gray-900 dark:text-white font-black' },
                  ].map(({ label, value, color }, i) => (
                    <div key={label}>
                      {i === 2 && <div className="h-px bg-gray-200 dark:bg-white/10 mb-4" />}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{label}</span>
                        <span className={cn('font-bold text-xl', color)}>{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-500">
                * Dedução de 25% em IRS até ao limite de 15% da coleta. NIPC: 510 378 242
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────── */}
      <section id="contacto" className="py-10 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920&auto=format&fit=crop&q=80"
            alt="CTA background"
            className="w-full h-full object-cover opacity-5"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-white/80 dark:from-gray-950 dark:via-gray-950/95 dark:to-gray-950/80" />
        </div>

        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.16, 0.08] }}
          transition={{ repeat: Infinity, duration: 5 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] z-0 pointer-events-none"
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-5 md:mb-8">
              <Star className="w-7 h-7 md:w-10 md:h-10 text-primary" />
            </div>
            <h2 className="text-3xl md:text-6xl font-black mb-4 leading-tight text-gray-900 dark:text-white">
              Pronto para fazer{' '}
              <span className="text-primary">a diferença?</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-lg mb-7 md:mb-10 leading-relaxed max-w-xl mx-auto">
              Entre em contacto connosco e juntos encontramos a melhor forma de associar
              a sua marca ao Hóquei Clube PDL.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowWhatsApp(true)}
                className="group inline-flex items-center justify-center gap-2 bg-primary text-gray-950 hover:bg-primary/90 font-heading font-black text-sm sm:text-base uppercase tracking-wider px-8 sm:px-10 py-4 sm:py-5 shadow-lg shadow-primary/25 w-full sm:w-auto transition-colors"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Entrar em Contacto
              </button>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary hover:text-gray-950 font-heading font-black text-sm sm:text-base uppercase tracking-wider px-8 sm:px-10 py-4 sm:py-5 w-full sm:w-auto transition-all duration-200"
              >
                Voltar ao Site
              </Link>
            </div>

            <div className="mt-10 text-gray-500 dark:text-gray-600 text-sm">
              NIPC 510 378 242 · Instituição de Utilidade Pública Desportiva · Sem fins lucrativos
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* ─── WHATSAPP MODAL ────────────────────────────────────────── */}
      {showWhatsApp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowWhatsApp(false)}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: easing }}
            className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowWhatsApp(false)}
              className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-green-500/15 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
              <WhatsAppIcon className="w-8 h-8 text-green-500 dark:text-green-400" />
            </div>

            <h3 className="text-xl font-black text-center mb-2 text-gray-900 dark:text-white">Contacto via WhatsApp</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm text-center leading-relaxed mb-1">
              Será redirecionado para o WhatsApp com o número oficial do clube:
            </p>
            <p className="text-gray-900 dark:text-white font-black text-center text-lg mb-6 tracking-wide">
              +351 910 413 531
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWhatsApp(false)}
                className="flex-1 py-3 border border-gray-200 dark:border-white/15 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-white/30 font-heading font-black text-xs uppercase tracking-wider transition-colors"
              >
                Cancelar
              </button>
              <a
                href="https://wa.me/351910413531"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowWhatsApp(false)}
                className="flex-1 py-3 bg-green-500 hover:bg-green-400 text-white font-heading font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Abrir WhatsApp
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
