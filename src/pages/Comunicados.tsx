import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Megaphone, FileText } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SocialIcons } from '@/components/SocialIcons';
import { comunicados, parseComunicadoDate, type Comunicado } from '@/data/siteData';

const COMUNICADOS_PER_PAGE = 6;

function formatDate(data: string) {
  return parseComunicadoDate(data).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
}

function ComunicadoCard({ comunicado, index }: { comunicado: Comunicado; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col"
    >
      <div className="p-6 flex flex-col flex-1">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{formatDate(comunicado.data)}</p>
        <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-2 leading-snug group-hover:text-primary transition-colors">
          {comunicado.titulo}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-5 line-clamp-3 flex-1">{comunicado.conteudo}</p>
        <div className="flex items-center gap-4">
          <Link
            to={`/comunicados/${comunicado.slug}`}
            className="text-primary font-semibold text-sm hover:text-primary/80 transition-colors self-start"
          >
            Ler mais →
          </Link>
          {comunicado.pdfUrl && (
            <a
              href={comunicado.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-400 dark:text-gray-500 hover:text-primary text-sm transition-colors"
            >
              <FileText className="w-3.5 h-3.5" /> PDF
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function Comunicados() {
  const [page, setPage] = useState(0);
  const sorted = [...comunicados].sort((a, b) => parseComunicadoDate(b.data).getTime() - parseComunicadoDate(a.data).getTime());
  const totalPages = Math.ceil(sorted.length / COMUNICADOS_PER_PAGE);
  const paginated = sorted.slice(page * COMUNICADOS_PER_PAGE, (page + 1) * COMUNICADOS_PER_PAGE);
  const showPagination = sorted.length > COMUNICADOS_PER_PAGE;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Comunicados — Hóquei Clube PDL</title>
        <meta name="description" content="Comunicados oficiais, resultados e novidades do Hóquei Clube PDL." />
        <link rel="canonical" href="https://hoqueiclubepdl.com/comunicados" />
        <meta property="og:title" content="Comunicados — Hóquei Clube PDL" />
        <meta property="og:description" content="Comunicados oficiais, resultados e novidades do Hóquei Clube PDL." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hoqueiclubepdl.com/comunicados" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Comunicados do Hóquei Clube PDL",
          "url": "https://hoqueiclubepdl.com/comunicados",
          "publisher": { "@type": "Organization", "name": "Hóquei Clube PDL" }
        })}</script>
      </Helmet>

      <Navigation />
      <SocialIcons />

      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 mb-4">
              <Megaphone className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3">Comunicados</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Comunicados oficiais, resultados e novidades do Hóquei Clube PDL.
            </p>
          </motion.div>

          {paginated.length === 0 ? (
            <p className="text-center text-gray-400 py-16">Nenhum comunicado publicado ainda.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((comunicado, i) => (
                <ComunicadoCard key={comunicado.slug} comunicado={comunicado} index={i} />
              ))}
            </div>
          )}

          {showPagination && (
            <div className="flex justify-center items-center gap-6 mt-12">
              <button
                onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={page === 0}
                className="px-5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={page === totalPages - 1}
                className="px-5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Próximo →
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
