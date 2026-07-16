import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Core Layout & UI Components
import { Navigation } from "@/components/Navigation";
import { CursorRing } from "@/components/CursorRing";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SocialIcons } from "@/components/SocialIcons";
import { Footer } from '@/components/Footer';
import { CookieConsent } from '@/components/CookieConsent';
import { FloatingActionButtons } from '@/components/FloatingActionButtons';
import HolidayOverlay from "@/components/HolidayOverlay";

// Overlay & Panel Components
import { RollerHockeyGame } from "@/components/RollerHockeyGame";
import { ComunicadosPanel } from '@/components/ComunicadosPanel';
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
  const [isComunicadosOpen, setIsComunicadosOpen] = useState(false);
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
  // It's good practice to move schema generation logic to a utility file
  // e.g., src/lib/seo.ts, but keeping it here is fine too.
  const eventsSchema = generateEventsSchema(senioresEvents, formacaoEvents);
  const newsSchema = generateNewsSchema(comunicados);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
      {/* <HolidayOverlay /> */}
      <Helmet>
        <title>Hóquei Clube PDL - Hóquei em Patins nos Açores</title>
        <meta name="description" content="Site oficial do Hóquei Clube PDL..." />
        <meta name="keywords" content="hóquei em patins, Ponta Delgada, Açores..." />
        <link rel="preload" fetchPriority="high" as="image" href="/uploads/PDL24-25V2.png" type="image/png" />
        <link rel="canonical" href="https://hoqueiclubepdl.com/" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsSchema) }} />
      </Helmet>

      {/* Core Layout & UI */}
      <CursorRing />
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
      <ComunicadosPanel isOpen={isComunicadosOpen} onClose={() => setIsComunicadosOpen(false)} data={comunicados} />
      {/* <ChatWidget /> */}

      {showCookieConsent && (
        <CookieConsent onAccept={acceptCookies} onReject={rejectCookies} />
      )}
    </div>
  );
};

export default Index;