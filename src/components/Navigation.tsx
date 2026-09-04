
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Mail } from 'lucide-react';
import { DonationsModal } from '@/components/DonationsModal';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NAV_LINKS } from '@/data/navLinks';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDonationsOpen, setIsDonationsOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';


  const linkClass =
    "relative text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-left after:transition-transform after:duration-300 hover:after:scale-x-100";

  return (
    <>
      <nav className="fixed w-full bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm dark:shadow-gray-900/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link
              to="/"
              className="flex-shrink-0 flex items-center gap-2"
              onClick={(e) => {
                if (isHome) {
                  e.preventDefault();
                  if (window.location.hash) window.history.replaceState(null, '', '/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              <div className="bg-white rounded-xl p-1.5 inline-flex shadow-sm border border-gray-200 dark:border-transparent hover:scale-105 transition-transform">
                <img
                  src="/uploads/pdlLogo.png"
                  alt="Hóquei Clube PDL"
                  className="h-8 w-auto"
                  loading="lazy"
                />
              </div>
              <span className="hidden lg:block font-heading font-black text-sm uppercase tracking-widest text-gray-900 dark:text-white">
                HC PDL
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((item) => (
                <Link key={item.name} to={item.href} className={linkClass}>{item.name}</Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="hidden lg:flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setIsDonationsOpen(true)}
                className="flex items-center gap-1.5 bg-primary text-gray-950 hover:bg-primary/90 px-4 py-2 font-heading font-black text-xs uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5"
              >
                <Heart className="w-3.5 h-3.5" />
                Doação
              </button>
              <Link
                to="/#contact"
                aria-label="Contactos"
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>

            {/* Mobile */}
            <div className="lg:hidden flex items-center gap-1">
              <ThemeToggle />
              <button
                className="p-2 text-gray-700 dark:text-gray-300 focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={isMenuOpen}
              >
                <div className="w-6 h-6 relative">
                  <span className={`block absolute w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-1'}`} />
                  <span className={`block absolute w-6 h-0.5 bg-current transition-all duration-300 top-1/2 -translate-y-1/2 ${isMenuOpen ? 'opacity-0 translate-x-4' : 'opacity-100'}`} />
                  <span className={`block absolute w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-1'}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div className={`lg:hidden fixed top-16 inset-x-0 transition-all duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none -translate-y-2'}`}>
          <div className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-lg border-b border-gray-100 dark:border-gray-800 px-4 py-4 space-y-1">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block px-4 py-3 rounded-lg text-gray-800 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-900 font-medium text-base transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setIsDonationsOpen(true); setIsMenuOpen(false); }}
                  className="flex flex-1 items-center gap-2 bg-primary text-gray-950 px-4 py-3 font-heading font-black text-sm uppercase tracking-wider transition-all"
                >
                  <Heart className="w-4 h-4" /> Doação
                </button>
                <Link
                  to="/#contact"
                  aria-label="Contactos"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-3 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <DonationsModal isOpen={isDonationsOpen} onClose={() => setIsDonationsOpen(false)} />
    </>
  );
};
