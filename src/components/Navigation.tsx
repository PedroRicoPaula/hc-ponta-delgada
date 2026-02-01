
import { useState } from 'react';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Sobre", href: "#about" },
    { name: "Treinos", href: "#training" },
    { name: "Jogos", href: "#events" },
    { name: "Equipa", href: "#team" },
    { name: "Galeria", href: "#gallery" },
    { name: "Patrocinadores", href: "#sponsors" },
    { name: "Contactos", href: "#contact" }
  ];

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a 
            href="#root" // ou qualquer ID que tenhas no topo da página
            className="flex-shrink-0" 
            onClick={(e) => {
              e.preventDefault(); // Previne o comportamento padrão do link
              window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll suave para o topo
            }}
          >
            <img 
              src="/uploads/13209336-cce9-4537-b6a8-01a8f59aaada.png" 
              // ⭐ MELHORIA SEO: alt text mais descritivo
              alt="Logótipo do Hóquei Clube Ponta Delgada" 
              className="h-12 w-auto hover:scale-105 transition-transform"
              loading="lazy"
            />
          </a>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="relative text-gray-800 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-left after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          {/* Mobile Menu Button - Animated Hamburger to X */}
          <div className="md:hidden">
            <button
              className="text-gray-800 p-2 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {/* Use relative positioning on the container */}
              <div className="w-6 h-6 relative">
                <span
                  className={`block absolute w-6 h-0.5 bg-gray-800 transition-all duration-700 ease-in-out ${
                    isMenuOpen
                      ? "top-1/2 -translate-y-1/2 rotate-[135deg]" // Rotates 3 * 45deg
                      : "top-1.5" // Position for hamburger
                  }`}
                ></span>
                <span
                  className={`block absolute w-6 h-0.5 bg-gray-800 transition-all duration-700 ease-in-out top-1/2 -translate-y-1/2 ${
                    isMenuOpen
                      ? "translate-x-12 opacity-0" // Slides 3rem (48px) to the right and fades out
                      : "opacity-100" // Stays in place and is visible
                  }`}
                ></span>
                <span
                  className={`block absolute w-6 h-0.5 bg-gray-800 transition-all duration-700 ease-in-out ${
                    isMenuOpen
                      ? "top-1/2 -translate-y-1/2 rotate-[-495deg]" // Rotates -135deg + -360deg spin
                      : "bottom-1.5" // Position for hamburger
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className={`md:hidden fixed top-16 right-0 w-1/2 transition-all duration-700 ease-in-out transform ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="px-6 py-6 space-y-4 bg-white/95 backdrop-blur-sm shadow-lg border-l min-h-screen">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="relative block text-gray-800 hover:text-primary px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-300 hover:bg-gray-100 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-left after:transition-transform after:duration-300 hover:after:scale-x-100"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};
