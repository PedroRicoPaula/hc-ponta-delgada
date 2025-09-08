
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

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
          <Link to="/" className="flex-shrink-0" onClick={() => window.location.reload()}>
            <img 
              src="/lovable-uploads/13209336-cce9-4537-b6a8-01a8f59aaada.png" 
              alt="PDL Hockey Club" 
              className="h-12 w-auto hover:scale-105 transition-transform"
            />
          </Link>
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
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-3 rounded-md text-gray-800 hover:text-primary hover:bg-gray-100 text-2xl w-12 h-12"
            >
              {isMenuOpen ? "✕" : "☰"}
            </Button>
          </div>
        </div>
      </div>
      <div className={`md:hidden fixed top-16 left-0 w-full transition-all duration-500 ease-in-out transform ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}`}>
        <div className="px-6 py-6 space-y-4 bg-white/95 backdrop-blur-sm shadow-lg border-t min-h-screen">
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
