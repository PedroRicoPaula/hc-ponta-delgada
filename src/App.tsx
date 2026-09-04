import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from 'next-themes';
import { ErrorBoundary } from "@/components/ErrorBoundary";
import RouteScrollReset from "@/components/RouteScrollReset";
import { CursorRing } from "@/components/CursorRing";
import Index from "./pages/Index";
import QueroSerPatrocinador from "./pages/QueroSerPatrocinador";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Modalidade from "./pages/Modalidade";
import Calendario from "./pages/Calendario";
import Merch from "./pages/Merch";
import Comunicados from "./pages/Comunicados";
import ComunicadoDetail from "./pages/ComunicadoDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <RouteScrollReset />
              <CursorRing />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/patrocinadores" element={<QueroSerPatrocinador />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/modalidade" element={<Modalidade />} />
                <Route path="/calendario" element={<Calendario />} />
                <Route path="/merch" element={<Merch />} />
                <Route path="/comunicados" element={<Comunicados />} />
                <Route path="/comunicados/:slug" element={<ComunicadoDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
