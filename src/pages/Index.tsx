import { useState, useEffect } from 'react';
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
import { DonationsModal } from '@/components/DonationsModal';
import { ComunicadosPanel } from '@/components/ComunicadosPanel';

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

const ScrollIndicator = () => (
  <div className="flex justify-center py-8">
    <div className="animate-bounce">
      <svg 
        className="w-8 h-12 text-primary opacity-70" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        viewBox="0 0 32 48" 
        stroke="currentColor"
      >
        <rect x="8" y="8" width="16" height="32" rx="8" ry="8" fill="none" stroke="currentColor"/>
        <circle cx="16" cy="18" r="2" fill="currentColor" className="animate-pulse"/>
        <path d="M16 22v6" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    </div>
  </div>
);

const Index = () => {
  // --- STATE MANAGEMENT ---
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isDonationsOpen, setIsDonationsOpen] = useState(false);
  const [isComunicadosOpen, setIsComunicadosOpen] = useState(false);

  // --- EFFECTS ---
  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      setShowCookieConsent(true);
    }
  }, []);

  // --- HANDLERS ---
  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowCookieConsent(false);
  };

  const rejectCookies = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setShowCookieConsent(false);
  };

  // --- SEO DATA ---
  // It's good practice to move schema generation logic to a utility file
  // e.g., src/lib/seo.ts, but keeping it here is fine too.
  const eventsSchema = generateEventsSchema(senioresEvents, formacaoEvents);
  const newsSchema = generateNewsSchema(comunicados);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* <HolidayOverlay /> */}
      <Helmet>
        <title>Hóquei Clube Ponta Delgada - Hóquei em Patins nos Açores</title>
        <meta name="description" content="Site oficial do Hóquei Clube de Ponta Delgada..." />
        <meta name="keywords" content="hóquei em patins, Ponta Delgada, Açores..." />
        <link rel="preload" fetchPriority="high" as="image" href="/lovable-uploads/PDL24-25V2.png" type="image/png" />
        <link rel="canonical" href="https://hoqueiclubepdl.com/" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsSchema) }} />
      </Helmet>

      {/* Core Layout & UI */}
      <Navigation />
      <SocialIcons />
      <ScrollToTop />
      <FloatingActionButtons 
        onOpenGame={() => setIsGameOpen(true)}
        onOpenComunicados={() => setIsComunicadosOpen(true)}
      />

      {/* Main Page Sections */}
      <main>
        <HeroSection />
        <ScrollIndicator />
        <AboutSection />
        <TrainingSchedulesSection />
        <EventsSection />
        <TeamSection />
        <GallerySection />
        <SponsorsSection />
        <ContactSection />
      </main>
      
      <Footer onOpenDonations={() => setIsDonationsOpen(true)} />

      {/* Overlays, Modals, and Panels */}
      <RollerHockeyGame isOpen={isGameOpen} onClose={() => setIsGameOpen(false)} />
      <DonationsModal isOpen={isDonationsOpen} onClose={() => setIsDonationsOpen(false)} />
      <ComunicadosPanel isOpen={isComunicadosOpen} onClose={() => setIsComunicadosOpen(false)} data={comunicados} />

      {showCookieConsent && (
        <CookieConsent onAccept={acceptCookies} onReject={rejectCookies} />
      )}
    </div>
  );
};

export default Index;