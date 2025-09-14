import { useState, useEffect, useRef } from 'react';
import { Facebook, Instagram, Youtube, Share2, X } from 'lucide-react';

export const SocialIcons = () => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "https://www.facebook.com/HoqueiClubePDL" },
    { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/hoqueiclubepdl/" },
    { name: "Youtube", icon: Youtube, url: "https://www.youtube.com/@HoqueiClubePDL" },
  ];

  // Fecha quando clicas fora ou pressionas Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <>
      {/* MOBILE: wrapper (botão + painel ao lado) */}
      <div
        ref={wrapperRef}
        className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50 sm:hidden"
        aria-hidden={false}
      >
        <div className="flex items-center gap-2 ml-1">
          {/* botão único no mobile */}
          <button
            onClick={() => setOpen(prev => !prev)}
            aria-expanded={open}
            aria-label="Abrir redes sociais"
            className="bg-primary text-white p-2 rounded-r-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {open ? <X className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
          </button>

          {/* painel com ícones (começa totalmente escondido) */}
          <nav
            className={`flex flex-col gap-3 bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg transform transition-all duration-250 ease-in-out
              ${open ? 'translate-x-0 opacity-100 pointer-events-auto' : '-translate-x-full opacity-0 pointer-events-none'}`}
            aria-hidden={!open}
          >
            {socialLinks.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-all duration-200"
                  aria-label={s.name}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* DESKTOP: barra lateral sempre visível (oculta no mobile) */}
      <div className="hidden sm:fixed sm:left-0 sm:top-1/2 sm:-translate-y-1/2 sm:z-40 sm:flex sm:flex-col sm:gap-4 sm:bg-white/80 sm:backdrop-blur-sm sm:p-3 sm:rounded-r-lg sm:shadow-lg">
        {socialLinks.map((s) => {
          const Icon = s.icon;
          return (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-all duration-200"
              aria-label={s.name}
            >
              <Icon className="h-6 w-6" />
            </a>
          );
        })}
      </div>
    </>
  );
};
