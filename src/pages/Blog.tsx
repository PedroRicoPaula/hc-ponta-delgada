import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SocialIcons } from '@/components/SocialIcons';
import { blogPosts, BlogPost } from '@/data/blogData';

const POSTS_PER_PAGE = 6;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
}

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col"
    >
      {post.photo && (
        <img src={post.photo} alt={post.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-6 flex flex-col flex-1">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{formatDate(post.date)}</p>
        <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-2 leading-snug group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-5 line-clamp-3 flex-1">{post.excerpt}</p>
        <Link
          to={`/blog/${post.slug}`}
          className="text-primary font-semibold text-sm hover:text-primary/80 transition-colors self-start"
        >
          Ler artigo →
        </Link>
      </div>
    </motion.article>
  );
}

export default function Blog() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);
  const paginated = blogPosts.slice(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE);
  const showPagination = blogPosts.length > POSTS_PER_PAGE;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Blog — Hóquei Clube Ponta Delgada</title>
        <meta name="description" content="Artigos, novidades e histórias sobre hóquei em patins do Hóquei Clube Ponta Delgada." />
        <link rel="canonical" href="https://hoqueiclubepdl.com/blog" />
        <meta property="og:title" content="Blog — Hóquei Clube Ponta Delgada" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Blog do Hóquei Clube Ponta Delgada",
          "url": "https://hoqueiclubepdl.com/blog",
          "publisher": { "@type": "Organization", "name": "Hóquei Clube Ponta Delgada" }
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
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3">Blog</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Artigos sobre hóquei em patins, novidades do clube e muito mais.
            </p>
          </motion.div>

          {paginated.length === 0 ? (
            <p className="text-center text-gray-400 py-16">Nenhum artigo publicado ainda.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((post, i) => (
                <PostCard key={post.slug} post={post} index={i} />
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
