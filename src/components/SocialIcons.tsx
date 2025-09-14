import { useState, useEffect, useRef } from 'react';
import { Facebook, Instagram, Youtube, Share2, X } from 'lucide-react';

export const SocialIcons = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "https://www.facebook.com/HoqueiClubePDL" },
    { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/hoqueiclubepdl/" },
    { name: "Youtube", icon: Youtube, url: "https://www.youtube.com/@HoqueiClubePDL" },
  ];

  // Fecha quando clicas fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Botão no mobile */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-primary text-white p-2 rounded-r-lg shadow-lg sm:hidden"
        aria-label="Abrir redes sociais"
      >
        {open ? <X className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
      </button>

      {/* Barra lateral - Mobile (toggle) */}
      <div
        ref={containerRef}
        className={`fixed top-1/2 -translate-y-1/2 z-40 bg-white/90 backdrop-blur-sm rounded-r-lg shadow-lg flex flex-col gap-4 p-3 transition-transform duration-300 ease-in-out sm:hidden
        ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{ left: "48px" }} // 👉 desloca a barra para a direita do botão
      >
        {socialLinks.map((social) => (
          <a 
            key={social.name} 
            href={social.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-all duration-300"
            aria-label={social.name}
          >
            <social.icon className="h-5 w-5" />
          </a>
        ))}
      </div>

      {/* Barra lateral - Desktop (sempre visível) */}
      <div 
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 sm:flex flex-col gap-4 bg-white/80 backdrop-blur-sm p-3 rounded-r-lg shadow-lg hidden"
      >
        {socialLinks.map((social) => (
          <a 
            key={social.name} 
            href={social.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-all duration-300"
            aria-label={social.name}
          >
            <social.icon className="h-6 w-6" />
          </a>
        ))}
      </div>
    </>
  );
};
