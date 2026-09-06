import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import RouteScrollReset from "@/components/RouteScrollReset";
import { CursorRing } from "@/components/CursorRing";
import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import Index from "./pages/Index";

const QueroSerPatrocinador = lazy(() => import("./pages/QueroSerPatrocinador"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Modalidade = lazy(() => import("./pages/Modalidade"));
const Calendario = lazy(() => import("./pages/Calendario"));
const Merch = lazy(() => import("./pages/Merch"));
const Pagamentos = lazy(() => import("./pages/Pagamentos"));
const Comunicados = lazy(() => import("./pages/Comunicados"));
const ComunicadoDetail = lazy(() => import("./pages/ComunicadoDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

const routeFallback = <div className="min-h-screen bg-background" />;

const App = () => (
  <ErrorBoundary>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <RouteScrollReset />
            <CursorRing />
            <AnalyticsConsent />
            <Suspense fallback={routeFallback}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/patrocinadores" element={<QueroSerPatrocinador />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/modalidade" element={<Modalidade />} />
                <Route path="/calendario" element={<Calendario />} />
                <Route path="/merch" element={<Merch />} />
                <Route path="/pagamentos" element={<Pagamentos />} />
                <Route path="/comunicados" element={<Comunicados />} />
                <Route path="/comunicados/:slug" element={<ComunicadoDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
