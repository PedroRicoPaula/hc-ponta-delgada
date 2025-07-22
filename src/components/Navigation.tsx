
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Sobre", href: "#about" },
    { name: "Equipa", href: "#team" },
    { name: "Galeria", href: "#gallery" },
    { name: "Jogos", href: "#events" },
    { name: "Contactos", href: "#contact" }
  ];

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <Link to="/" className="flex-shrink-0">
            <img 
              src="/lovable-uploads/13209336-cce9-4537-b6a8-01a8f59aaada.png" 
              alt="PDL Hockey Club" 
              className="h-28 w-auto hover:scale-105 transition-transform"
            />
          </Link>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="relative text-gray-800 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-black after:origin-bottom-left after:transition-transform after:duration-300 hover:after:scale-x-100"
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
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-primary hover:bg-gray-100"
            >
              {isMenuOpen ? "✕" : "☰"}
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="relative text-gray-800 hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-black after:origin-bottom-left after:transition-transform after:duration-300 hover:after:scale-x-100"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
