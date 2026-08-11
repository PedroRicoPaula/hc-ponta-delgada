import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Info, History, Users, ScrollText, Package, BookOpen, type LucideIcon } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SocialIcons } from '@/components/SocialIcons';

interface Section {
  id: string;
  title: string;
  icon: LucideIcon;
  content: React.ReactNode;
}

const positionAccent: Record<string, string> = {
  "Guarda-Redes": "bg-blue-500",
  "Defesa":       "bg-green-500",
  "Médio":        "bg-purple-500",
  "Avançado":     "bg-red-500",
  "Universal":    "bg-yellow-500",
};

const sections: Section[] = [
  {
    id: "o-que-e",
    title: "O que é?",
    icon: Info,
    content: (
      <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <p>
          O <strong>hóquei em patins</strong> — também conhecido internacionalmente como <em>rink hockey</em> ou <em>roller hockey</em> — é uma modalidade desportiva coletiva disputada em patins de quatro rodas sobre um piso liso, num rinque fechado. Duas equipas de cinco jogadores cada, quatro de campo e um guarda-redes, disputam a posse de uma bola com sticks curvos, tentando introduzi-la na baliza adversária.
        </p>
        <p>
          É uma das modalidades de patinagem mais antigas do mundo, reconhecida pela World Skate — o organismo internacional que regula todos os desportos sobre patins — e disputada em competições oficiais desde a década de 1930.
        </p>
        <p>
          Em Portugal é um desporto de grande tradição e um dos que mais títulos internacionais trouxe ao país. A Federação de Patinagem de Portugal (FPP) é o organismo que regula a modalidade a nível nacional.
        </p>
        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-4">
          <p className="font-semibold text-primary text-sm">Sabia que?</p>
          <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
            Portugal é a segunda seleção mais titulada da história do Campeonato do Mundo, com 16 títulos — atrás apenas de Espanha (18) e à frente da Argentina (6). Em setembro de 2025 sagrou-se também Campeã Europeia.
          </p>
        </div>
      </div>
    )
  },
  {
    id: "historia",
    title: "História",
    icon: History,
    content: (
      <div className="space-y-5 text-gray-700 dark:text-gray-300 leading-relaxed">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1.5">Origem em Inglaterra</h3>
          <p>
            O primeiro jogo registado de hóquei em patins decorreu em 1878, no Denmark Rink, em Londres. A modalidade organizou-se de forma competitiva em Inglaterra a partir do início do século XX e espalhou-se rapidamente pela Europa, enraizando-se sobretudo em Portugal, Espanha, Itália e França — e mais tarde na Argentina.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1.5">Organização internacional</h3>
          <p>
            Em abril de 1924, em Montreux, na Suíça, foi fundada a Fédération Internationale de Roller Sports (FIRS), reunindo desde o início representantes de França, Alemanha, Grã-Bretanha e Suíça. Foi este organismo que redigiu as primeiras regras oficiais do jogo. O primeiro Campeonato do Mundo disputou-se em 1936, em Estugarda, na Alemanha, com a Inglaterra a sagrar-se campeã. Em 2017 a FIRS fundiu-se com a Federação Internacional de Skateboard e deu origem à <strong>World Skate</strong>, o organismo que regula a modalidade a nível mundial até hoje.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1.5">Portugal, uma potência mundial</h3>
          <p>
            Portugal é a segunda nação mais titulada da história do Campeonato do Mundo — 16 títulos, atrás apenas de Espanha (18) — e é a atual Campeã Europeia, título conquistado em setembro de 2025. Um dos palmarés mais consistentes de qualquer modalidade coletiva portuguesa.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1.5">O hóquei em patins nos Açores</h3>
          <p>
            Nos Açores, a modalidade chegou décadas mais tarde. O <strong>Hóquei Clube PDL</strong> foi fundado em 2012 com o objetivo de promover e desenvolver o hóquei em patins no arquipélago, da formação de base à competição sénior.
          </p>
        </div>
      </div>
    )
  },
  {
    id: "posicoes",
    title: "Posições",
    icon: Users,
    content: (
      <div className="space-y-3">
        {[
          { pos: "Guarda-Redes", desc: "Defende a baliza e é o único jogador autorizado a tocar na bola com as mãos dentro da própria área. É também o único que pode jogar a bola acima de 1,50 m de altura. Usa equipamento de proteção adicional." },
          { pos: "Defesa", desc: "Primeira linha de contenção — protege a baliza própria e trava os ataques adversários. Exige boa leitura tática e solidez física nos duelos individuais." },
          { pos: "Médio", desc: "Elemento de ligação entre defesa e ataque, presente nas duas fases do jogo. Precisa de resistência, visão de jogo e versatilidade." },
          { pos: "Avançado", desc: "Principal responsável pela criação e concretização de oportunidades de golo. Exige velocidade, técnica individual e frieza no remate." },
          { pos: "Universal", desc: "Jogador polivalente, capaz de atuar em qualquer posição com a mesma eficácia — muito valorizado pela flexibilidade tática que oferece à equipa." },
        ].map(({ pos, desc }) => (
          <div key={pos} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600">
            <span className={`w-1 rounded-full flex-shrink-0 ${positionAccent[pos]}`} />
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{pos}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    )
  },
  {
    id: "regras",
    title: "Regras Básicas",
    icon: ScrollText,
    content: (
      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        {[
          { rule: "Composição das equipas", desc: "Cada equipa tem 5 jogadores em campo: 4 jogadores de campo e 1 guarda-redes. Os bancos de suplentes têm normalmente 3 a 5 atletas." },
          { rule: "Duração do jogo", desc: "Dois períodos de 25 minutos ao mais alto nível (20 minutos na formação), com 10 minutos de intervalo. Em caso de empate em eliminatórias, há lugar a prolongamento e, se necessário, marcação de grandes penalidades." },
          { rule: "Marcação de golos", desc: "O golo é válido quando a bola cruza por completo a linha de baliza. A bola não pode ultrapassar 1,50 m de altura, exceto quando jogada pelo guarda-redes dentro da própria área." },
          { rule: "Faltas de equipa e livre direto", desc: "As faltas de cada equipa são contabilizadas por período; a partir da 10ª falta, a equipa adversária marca um livre direto, batido a 7,40 m da linha de baliza." },
          { rule: "Cartões", desc: "Cartão azul: exclusão temporária de 2 minutos por falta grave ou por travar um contra-ataque com clara possibilidade de golo. Cartão vermelho: expulsão, com a equipa a ficar em inferioridade numérica." },
          { rule: "Grande penalidade (penalty)", desc: "Lançamento marcado a 5,40 m da linha de baliza, disputado 1x1 entre o atacante e o guarda-redes." },
          { rule: "Área de baliza", desc: "Só o guarda-redes pode entrar na área semicircular junto à própria baliza — qualquer invasão por um jogador de campo é assinalada como falta." },
        ].map(({ rule, desc }) => (
          <div key={rule} className="border-l-2 border-primary pl-4 py-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{rule}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-0.5">{desc}</p>
          </div>
        ))}
      </div>
    )
  },
  {
    id: "equipamento",
    title: "Equipamento",
    icon: Package,
    content: (
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { item: "Patins", desc: "Patins de rodas (quad), com quatro rodas. O tipo e o durómetro (dureza) da roda influenciam a velocidade e a aderência ao piso." },
          { item: "Stick", desc: "Cabo com lâmina curvada, com 0,90 a 1,15 m de comprimento. Pode ser de madeira, fibra de vidro ou carbono — o peso e a rigidez variam com a função e a preferência do atleta." },
          { item: "Bola", desc: "Bola de cortiça revestida a borracha vulcanizada, com cerca de 155 g e 23 cm de circunferência — bem diferente do puck do hóquei no gelo." },
          { item: "Capacete", desc: "Obrigatório para todos os atletas de formação e para o guarda-redes em qualquer escalão. Protege a cabeça de impactos com a bola, o stick ou em queda." },
          { item: "Proteções", desc: "Joelheiras, cotoveleiras e luvas são essenciais para proteger as articulações em quedas e contactos físicos." },
          { item: "Equipamento do guarda-redes", desc: "Proteção adicional: coquilha, peitoral, caneleiras reforçadas, luvas especiais e máscara facial." },
        ].map(({ item, desc }) => (
          <div key={item} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-100 dark:border-gray-600">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1.5">{item}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{desc}</p>
          </div>
        ))}
      </div>
    )
  },
  {
    id: "glossario",
    title: "Glossário",
    icon: BookOpen,
    content: (
      <div className="space-y-3">
        {[
          { term: "Grande Penalidade", def: "Também chamado penalty. Lançamento 1x1 entre atacante e guarda-redes, marcado a 5,40 m da linha de baliza." },
          { term: "Livre Direto", def: "Lançamento concedido à equipa adversária a partir da 10ª falta de equipa no período, batido a 7,40 m da linha de baliza." },
          { term: "Cartão Azul", def: "Exclusão temporária de 2 minutos por falta grave ou por travar um contra-ataque com clara possibilidade de golo." },
          { term: "Bully", def: "Disputa da bola entre dois jogadores adversários, usada para reiniciar o jogo em situações específicas." },
          { term: "Power Play", def: "Superioridade numérica temporária de uma equipa, resultante de um cartão azul ao adversário." },
          { term: "Pressing", def: "Sistema defensivo de pressão alta, a tentar recuperar a bola perto da baliza adversária." },
          { term: "Desmarcação", def: "Movimento sem bola para criar espaço e receber um passe em boa posição." },
          { term: "GR", def: "Abreviatura de guarda-redes." },
          { term: "FPP", def: "Federação de Patinagem de Portugal — organismo regulador da modalidade em Portugal." },
          { term: "World Skate", def: "Organismo internacional que regula o hóquei em patins e as restantes modalidades de patinagem, herdeiro da FIRS (fundada em 1924)." },
          { term: "Escalão", def: "Categoria etária de competição: Sub-11, Sub-13, Sub-15, Sub-17, Sub-20 e Seniores." },
          { term: "Zona", def: "Divisão geográfica da competição nacional: Zona Norte, Zona Centro, Zona Sul e zona das ilhas." },
        ].map(({ term, def }) => (
          <div key={term} className="flex flex-col sm:flex-row sm:gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <dt className="font-bold text-primary text-sm sm:min-w-[160px] flex-shrink-0">{term}</dt>
            <dd className="text-gray-600 dark:text-gray-400 text-sm mt-0.5 sm:mt-0">{def}</dd>
          </div>
        ))}
      </div>
    )
  },
];

export default function Modalidade() {
  const [activeSection, setActiveSection] = useState('o-que-e');

  useEffect(() => {
    const handleScroll = () => {
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) setActiveSection(section.id);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Helmet>
        <title>Hóquei em Patins — Regras, História e Guia Completo | HC PDL</title>
        <meta name="description" content="Guia completo sobre hóquei em patins: história desde 1878, regras básicas, posições, equipamento e glossário. Criado pelo Hóquei Clube PDL, Açores." />
        <link rel="canonical" href="https://hoqueiclubepdl.com/modalidade/" />
        <meta property="og:title" content="Hóquei em Patins — Guia Completo | HC PDL" />
        <meta property="og:description" content="Tudo sobre hóquei em patins: história, regras, posições, equipamento e glossário. Guia completo do Hóquei Clube PDL, Açores." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://hoqueiclubepdl.com/modalidade/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Guia Completo de Hóquei em Patins — Regras, História, Posições e Equipamento",
          "description": "Tudo sobre o hóquei em patins: história desde 1878, regras básicas, posições em campo, equipamento necessário e glossário de termos.",
          "author": { "@type": "Organization", "name": "Hóquei Clube PDL", "url": "https://hoqueiclubepdl.com/" },
          "publisher": { "@type": "Organization", "name": "Hóquei Clube PDL", "logo": { "@type": "ImageObject", "url": "https://hoqueiclubepdl.com/uploads/pdlLogo.png" } },
          "url": "https://hoqueiclubepdl.com/modalidade",
          "datePublished": "2024-01-01",
          "dateModified": "2026-07-01",
          "inLanguage": "pt-PT",
          "about": { "@type": "Thing", "name": "Hóquei em Patins" }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "O que é o hóquei em patins?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "O hóquei em patins — também conhecido como rink hockey ou roller hockey — é uma modalidade desportiva coletiva disputada em patins de quatro rodas sobre um piso liso. Duas equipas de cinco jogadores cada (quatro de campo e um guarda-redes) tentam introduzir uma bola na baliza adversária com sticks curvos."
              }
            },
            {
              "@type": "Question",
              "name": "Quantos jogadores tem uma equipa de hóquei em patins?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Cada equipa tem 5 jogadores em campo: 4 jogadores de campo e 1 guarda-redes. Os bancos de suplentes têm normalmente 3 a 5 atletas adicionais."
              }
            },
            {
              "@type": "Question",
              "name": "Quanto tempo dura um jogo de hóquei em patins?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Um jogo de hóquei em patins tem dois períodos de 25 minutos ao mais alto nível (20 minutos na formação), com 10 minutos de intervalo. Em caso de empate em eliminatórias, há prolongamento e, se necessário, marcação de grandes penalidades."
              }
            },
            {
              "@type": "Question",
              "name": "Qual é o equipamento necessário para jogar hóquei em patins?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "O equipamento básico inclui: patins de rodas (quad) com quatro rodas, stick com lâmina curvada, capacete (obrigatório na formação), joelheiras, cotoveleiras e luvas. O guarda-redes usa proteção adicional: coquilha, peitoral, caneleiras reforçadas e máscara facial."
              }
            },
            {
              "@type": "Question",
              "name": "O que é um cartão azul no hóquei em patins?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "O cartão azul no hóquei em patins significa uma exclusão temporária de 2 minutos por falta grave ou por travar um contra-ataque com clara possibilidade de golo. Durante esses 2 minutos, a equipa fica em inferioridade numérica (power play para o adversário)."
              }
            },
            {
              "@type": "Question",
              "name": "Qual é a diferença entre grande penalidade e livre direto no hóquei em patins?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A grande penalidade (penalty) é marcada a 5,40 m da baliza em disputa 1x1. O livre direto é concedido a partir da 10ª falta de equipa no período, marcado a 7,40 m da baliza. O livre direto tem ângulo e distância diferentes do penalty."
              }
            }
          ]
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://hoqueiclubepdl.com/" },
            { "@type": "ListItem", "position": 2, "name": "Modalidade", "item": "https://hoqueiclubepdl.com/modalidade" }
          ]
        })}</script>
      </Helmet>

      <Navigation />
      <SocialIcons />

      <div className="pt-20">
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-10 px-4">
          <div className="max-w-5xl mx-auto">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Documentação</span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mt-1 mb-2">Hóquei em Patins</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl">Guia completo sobre a modalidade — do básico ao avançado. Ideal para novos praticantes, pais e curiosos.</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Nesta página</p>
              <nav className="space-y-1">
                {sections.map(s => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                      activeSection === s.id
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <s.icon className="w-4 h-4 flex-shrink-0" />
                    {s.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Mobile section picker */}
          <div className="md:hidden w-full mb-6">
            <select
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={activeSection}
              onChange={(e) => { setActiveSection(e.target.value); scrollTo(e.target.value); }}
            >
              {sections.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>

          {/* Content */}
          <main className="flex-1 min-w-0 space-y-12">
            {sections.map((s, i) => (
              <motion.section
                key={s.id}
                id={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="scroll-mt-28"
              >
                <div className="flex items-center gap-3 mb-5">
                  <s.icon className="w-5 h-5 text-primary flex-shrink-0" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{s.title}</h2>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                  {s.content}
                </div>
              </motion.section>
            ))}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
