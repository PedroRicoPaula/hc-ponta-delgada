import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Home } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SocialIcons } from "@/components/SocialIcons";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Helmet>
        <title>Página não encontrada — Hóquei Clube Ponta Delgada</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <Navigation />
      <SocialIcons />

      <main className="flex-1 flex items-center justify-center px-4 py-32 text-center">
        <div>
          <p className="font-heading text-8xl md:text-9xl uppercase leading-none text-primary mb-4">
            404
          </p>
          <h1 className="font-heading text-3xl md:text-4xl uppercase text-gray-900 dark:text-white mb-3">
            Página não encontrada
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            A página que procuras não existe ou foi movida.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-gray-950 px-6 py-3 font-heading font-black text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" /> Voltar ao Início
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
