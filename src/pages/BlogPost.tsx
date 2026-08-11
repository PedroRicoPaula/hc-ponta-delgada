import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Clock, Tag, ArrowLeft, Calendar, User } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SocialIcons } from '@/components/SocialIcons';
import { getBlogPost } from '@/data/blogData';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Minimal markdown-to-HTML renderer — includes dark mode classes
function renderMarkdown(md: string): string {
  const lines = md.split('\n');
  const out: string[] = [];
  let inList = false;

  const esc = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const inline = (s: string) => s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-1 rounded text-sm">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline hover:no-underline">$1</a>');

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith('## ')) {
      if (inList) { out.push('</ul>'); inList = false; }
      out.push(`<h2 class="text-2xl font-bold mt-10 mb-4 text-gray-900 dark:text-white">${inline(esc(line.slice(3)))}</h2>`);
    } else if (line.startsWith('### ')) {
      if (inList) { out.push('</ul>'); inList = false; }
      out.push(`<h3 class="text-xl font-bold mt-6 mb-3 text-gray-800 dark:text-gray-200">${inline(esc(line.slice(4)))}</h3>`);
    } else if (line.startsWith('---')) {
      if (inList) { out.push('</ul>'); inList = false; }
      out.push('<hr class="my-8 border-gray-200 dark:border-gray-700"/>');
    } else if (line.startsWith('- ')) {
      if (!inList) { out.push('<ul class="list-disc list-inside space-y-1 my-4 text-gray-700 dark:text-gray-300">'); inList = true; }
      out.push(`<li>${inline(esc(line.slice(2)))}</li>`);
    } else if (line === '') {
      if (inList) { out.push('</ul>'); inList = false; }
    } else {
      if (inList) { out.push('</ul>'); inList = false; }
      out.push(`<p class="text-gray-700 dark:text-gray-300 leading-relaxed my-3">${inline(esc(line))}</p>`);
    }
  }
  if (inList) out.push('</ul>');
  return out.join('\n');
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPost(slug ?? '');

  if (!post) return <Navigate to="/blog" replace />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.date,
    "dateModified": post.date,
    "wordCount": post.content.split(/\s+/).length,
    "timeRequired": `PT${post.readTime}M`,
    "inLanguage": "pt-PT",
    "author": { "@type": "Organization", "name": post.author, "url": "https://hoqueiclubepdl.com/" },
    "publisher": {
      "@type": "Organization",
      "name": "Hóquei Clube PDL",
      "url": "https://hoqueiclubepdl.com/",
      "logo": { "@type": "ImageObject", "url": "https://hoqueiclubepdl.com/uploads/pdlLogo.png" }
    },
    "url": `https://hoqueiclubepdl.com/blog/${post.slug}/`,
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://hoqueiclubepdl.com/blog/${post.slug}/` },
    ...(post.photo ? { "image": { "@type": "ImageObject", "url": `https://hoqueiclubepdl.com${post.photo}` } } : {})
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://hoqueiclubepdl.com/" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://hoqueiclubepdl.com/blog" },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://hoqueiclubepdl.com/blog/${post.slug}/` }
    ]
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Helmet>
        <title>{post.title} — HC PDL Blog</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://hoqueiclubepdl.com/blog/${post.slug}/`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://hoqueiclubepdl.com/blog/${post.slug}/`} />
        {post.photo && <meta property="og:image" content={`https://hoqueiclubepdl.com${post.photo}`} />}
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>

      <Navigation />
      <SocialIcons />

      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar ao Blog
            </Link>

            {post.photo ? (
              <img src={post.photo} alt={post.title} className="w-full rounded-2xl mb-8 object-cover max-h-80" />
            ) : (
              <div className="w-full h-40 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-8">
                <span className="text-6xl">🏒</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span className="bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full text-xs">{post.category}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(post.date)}</span>
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{post.author}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime} min de leitura</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-4">{post.title}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-8 border-l-4 border-primary pl-4">{post.excerpt}</p>

            <div
              className="prose-custom"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
            />

            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
              {post.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                  <Tag className="w-3 h-3" />{tag}
                </span>
              ))}
            </div>

            <Link
              to="/blog"
              className="inline-flex items-center gap-1 mt-8 text-primary font-semibold hover:gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Ver todos os artigos
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
