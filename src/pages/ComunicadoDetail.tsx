import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, FileText, Megaphone } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SocialIcons } from '@/components/SocialIcons';
import { getComunicado, parseComunicadoDate } from '@/data/siteData';

function formatDate(data: string) {
  return parseComunicadoDate(data).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ComunicadoDetail() {
  const { slug } = useParams<{ slug: string }>();
  const comunicado = getComunicado(slug ?? '');

  if (!comunicado) return <Navigate to="/comunicados" replace />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": comunicado.titulo,
    "datePublished": parseComunicadoDate(comunicado.data).toISOString(),
    "dateModified": parseComunicadoDate(comunicado.data).toISOString(),
    "articleBody": comunicado.conteudo,
    "inLanguage": "pt-PT",
    "author": { "@type": "Organization", "name": "Hóquei Clube PDL", "url": "https://hoqueiclubepdl.com/" },
    "publisher": {
      "@type": "Organization",
      "name": "Hóquei Clube PDL",
      "url": "https://hoqueiclubepdl.com/",
      "logo": { "@type": "ImageObject", "url": "https://hoqueiclubepdl.com/uploads/pdlLogo.png" }
    },
    "url": `https://hoqueiclubepdl.com/comunicados/${comunicado.slug}`,
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://hoqueiclubepdl.com/comunicados/${comunicado.slug}` }
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://hoqueiclubepdl.com/" },
      { "@type": "ListItem", "position": 2, "name": "Comunicados", "item": "https://hoqueiclubepdl.com/comunicados" },
      { "@type": "ListItem", "position": 3, "name": comunicado.titulo, "item": `https://hoqueiclubepdl.com/comunicados/${comunicado.slug}` }
    ]
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Helmet>
        <title>{comunicado.titulo} — HC PDL Comunicados</title>
        <meta name="description" content={comunicado.conteudo.slice(0, 155)} />
        <link rel="canonical" href={`https://hoqueiclubepdl.com/comunicados/${comunicado.slug}`} />
        <meta property="og:title" content={comunicado.titulo} />
        <meta property="og:description" content={comunicado.conteudo.slice(0, 155)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://hoqueiclubepdl.com/comunicados/${comunicado.slug}`} />
        <meta name="twitter:card" content="summary" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>

      <Navigation />
      <SocialIcons />

      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Link
              to="/comunicados"
              className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar aos Comunicados
            </Link>

            <div className="w-full h-40 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-8">
              <Megaphone className="w-14 h-14 text-primary/70" />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(comunicado.data)}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-8">{comunicado.titulo}</h1>

            <div className="space-y-4">
              {comunicado.conteudo.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed">{paragraph}</p>
              ))}
            </div>

            {comunicado.pdfUrl && (
              <a
                href={comunicado.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 bg-primary text-gray-950 hover:bg-primary/90 transition-colors font-heading font-black text-xs uppercase tracking-wider px-5 py-3"
              >
                <FileText className="w-4 h-4" /> Consultar PDF
              </a>
            )}

            <Link
              to="/comunicados"
              className="flex items-center gap-1 mt-10 pt-8 border-t border-gray-200 dark:border-gray-700 text-primary font-semibold hover:gap-2 transition-all w-fit"
            >
              <ArrowLeft className="w-4 h-4" /> Ver todos os comunicados
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
