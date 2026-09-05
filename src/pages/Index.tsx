import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Core Layout & UI Components
import { Navigation } from "@/components/Navigation";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SocialIcons } from "@/components/SocialIcons";
import { Footer } from '@/components/Footer';
import { CookieConsent } from '@/components/CookieConsent';
import { FloatingActionButtons } from '@/components/FloatingActionButtons';
import HolidayOverlay from "@/components/HolidayOverlay";

// Overlay & Panel Components
import { RollerHockeyGame } from "@/components/RollerHockeyGame";
// import { ChatWidget } from '@/components/ChatWidget';

// Section Components
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { TrainingSchedulesSection } from '@/components/sections/TrainingSchedulesSection';
import { EventsSection } from '@/components/sections/EventsSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { SponsorsSection } from '@/components/sections/SponsorsSection';
import { ContactSection } from '@/components/sections/ContactSection';

// Data
import { senioresEvents, formacaoEvents, comunicados } from '@/data/siteData';
import { generateEventsSchema, generateNewsSchema } from '@/lib/seo';
import { safeStorage } from '@/lib/safeStorage';


const Index = () => {
  // --- STATE MANAGEMENT ---
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const location = useLocation();

  // --- EFFECTS ---
  useEffect(() => {
    const cookieConsent = safeStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      setShowCookieConsent(true);
    }
  }, []);

  // Scroll to the section named in the URL hash — needed because links to
  // "/#contact" from other pages land here before the section exists in the
  // DOM, so the browser's native hash-jump on page load silently does nothing.
  useEffect(() => {
    if (!location.hash) return;
    const el = document.querySelector(location.hash);
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth' }));
    }
  }, [location.hash]);

  // --- HANDLERS ---
  const acceptCookies = () => {
    safeStorage.setItem('cookie-consent', 'accepted');
    setShowCookieConsent(false);
  };

  const rejectCookies = () => {
    safeStorage.setItem('cookie-consent', 'rejected');
    setShowCookieConsent(false);
  };

  // --- SEO DATA ---
  const eventsSchema = generateEventsSchema(senioresEvents, formacaoEvents);
  const newsSchema = generateNewsSchema(comunicados);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "O que é o Hóquei Clube PDL?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O Hóquei Clube PDL (HCPDL) é um clube de hóquei em patins fundado em 2012 em Ponta Delgada, Açores. Compete no Campeonato Nacional da 3.ª Divisão da FPP e tem formação Sub-11, Sub-13 e Sub-17. Em São Miguel há outros clubes da modalidade, como o Caldeiras HC e o Marítimo SC."
        }
      },
      {
        "@type": "Question",
        "name": "Onde treina o Hóquei Clube PDL?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O Hóquei Clube PDL treina e joga no Pavilhão Sidório Serpa, localizado na Rua do Mercado, 31, 9500-326 Ponta Delgada, Açores."
        }
      },
      {
        "@type": "Question",
        "name": "Como posso inscrever o meu filho no Hóquei Clube PDL?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Para inscrições no Hóquei Clube PDL, pode contactar o clube por email em hoquei.clube.pdl@gmail.com ou por telefone para +351 296 382 987. O clube tem escalões de formação para Sub-11, Sub-13 e Sub-17."
        }
      },
      {
        "@type": "Question",
        "name": "Em que competições participa o Hóquei Clube PDL?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O Hóquei Clube PDL participa no Campeonato Nacional da 3ª Divisão organizado pela Federação de Patinagem de Portugal (FPP), bem como em competições regionais nos Açores com os escalões de formação."
        }
      },
      {
        "@type": "Question",
        "name": "Como posso apoiar ou patrocinar o Hóquei Clube PDL?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pode apoiar o Hóquei Clube PDL através de patrocínio (com visibilidade na camisola, no pavilhão e nos canais digitais), donativos com benefícios fiscais (dedução de 25% em IRS para particulares e majoração até 120% em IRC para empresas), ou contactando o clube em hoquei.clube.pdl@gmail.com."
        }
      },
      {
        "@type": "Question",
        "name": "Como posso comprar merch oficial do Hóquei Clube PDL?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A merch oficial reserva-se em hoqueiclubepdl.com/merch. Não há envios: escolhe as peças, envia o pedido por email, transfere para o IBAN do clube com comprovativo e levanta no Pavilhão Sidónio Serpa, em Ponta Delgada. Não há pagamento no site. O preço de sócio é confirmado pelo clube."
        }
      },
      {
        "@type": "Question",
        "name": "Como pago quotas e mensalidades no site?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Em hoqueiclubepdl.com/pagamentos o site calcula quotas 2026/27 e mensalidades de formação (Setembro a Junho). Abres o email, transfere para o IBAN do clube e anexas o comprovativo. Não há pagamento no site. O clube confirma. Pedir declaração para IRS não garante que o valor seja donativo de mecenato."
        }
      },
      {
        "@type": "Question",
        "name": "O Hóquei Clube PDL transmite os jogos online?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim, os jogos em casa da equipa sénior do Hóquei Clube PDL são transmitidos ao vivo no canal do YouTube @HoqueiClubePDL."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Início",
        "item": "https://hoqueiclubepdl.com/"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
      {/* <HolidayOverlay /> */}
      <Helmet>
        <title>Hóquei Clube PDL - Hóquei em Patins nos Açores desde 2012</title>
        <meta name="description" content="Site oficial do Hóquei Clube PDL — clube de hóquei em patins fundado em 2012 em Ponta Delgada, Açores. Escalões Sub-11, Sub-13, Sub-17 e Seniores. Jogos transmitidos no YouTube." />
        <meta name="keywords" content="hóquei em patins, Ponta Delgada, Açores, HCPDL, hóquei patins Açores, clube hóquei São Miguel, formação hóquei patins, campeonato nacional hóquei patins" />
        <link rel="preload" fetchPriority="high" as="image" href="/uploads/PDL24-25V2.png" type="image/png" />
        <link rel="canonical" href="https://hoqueiclubepdl.com/" />
        <meta property="og:title" content="Hóquei Clube PDL — Hóquei em Patins nos Açores" />
        <meta property="og:description" content="Site oficial do Hóquei Clube PDL — clube de hóquei em patins fundado em 2012 em Ponta Delgada, Açores. Escalões Sub-11, Sub-13, Sub-17 e Seniores." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hoqueiclubepdl.com/" />
        {/*
          Inside <Helmet>, JSON-LD has to be passed as a string child.
          react-helmet-async ignores dangerouslySetInnerHTML on <script> — it
          reads children only, sees an empty tag, and drops it. These four
          schemas were silently absent from the rendered HTML until this was
          changed (verified against the prerendered output: 3 blocks present,
          all four Helmet ones missing, while the title from the same Helmet
          block came through fine).
        */}
        <script type="application/ld+json">{JSON.stringify(eventsSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(newsSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* Core Layout & UI */}
      <Navigation />
      <SocialIcons />
      <ScrollToTop />
      <FloatingActionButtons
        onOpenGame={() => setIsGameOpen(true)}
      />

      {/* Main Page Sections */}
      <main>
        <HeroSection />
        <AboutSection />
        <TrainingSchedulesSection />
        <EventsSection />
        <TeamSection />
        <GallerySection />
        <SponsorsSection />
        <ContactSection />
      </main>
      
      <Footer />

      {/* Overlays, Modals, and Panels */}
      <RollerHockeyGame isOpen={isGameOpen} onClose={() => setIsGameOpen(false)} />
      {/* <ChatWidget /> */}

      {showCookieConsent && (
        <CookieConsent onAccept={acceptCookies} onReject={rejectCookies} />
      )}
    </div>
  );
};

export default Index;
