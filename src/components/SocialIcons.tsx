import { useState, useEffect, useRef } from 'react';
import { Facebook, Instagram, Youtube, Share2, X } from 'lucide-react';

const socialLinks = [
  { name: "Facebook",  icon: Facebook,  url: "https://www.facebook.com/HoqueiClubePDL" },
  { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/hoqueiclubepdl/" },
  { name: "Youtube",   icon: Youtube,   url: "https://www.youtube.com/@HoqueiClubePDL" },
];

function SocialLink({ s }: { s: typeof socialLinks[number] }) {
  const Icon = s.icon;
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={s.name}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-primary hover:text-gray-950 dark:hover:bg-primary dark:hover:text-gray-950 transition-all duration-200"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'perspective(400px) rotateY(-12deg) scale(1.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = '';
      }}
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

export const SocialIcons = () => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <>
      {/* MOBILE */}
      <div ref={wrapperRef} className="fixed left-0 top-[68%] -translate-y-1/2 z-50 sm:hidden">
        <div className="flex items-center gap-2 ml-1">
          <button
            onClick={() => setOpen(prev => !prev)}
            aria-expanded={open}
            aria-label="Abrir redes sociais"
            className="bg-primary text-gray-950 p-2 rounded-r-lg shadow-md focus:outline-none"
          >
            {open ? <X className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          </button>
          <nav
            className={`flex flex-col gap-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-2 rounded-lg shadow-lg transition-all duration-200 ${open ? 'translate-x-0 opacity-100 pointer-events-auto' : '-translate-x-full opacity-0 pointer-events-none'}`}
            aria-hidden={!open}
          >
            {socialLinks.map((s) => <SocialLink key={s.name} s={s} />)}
          </nav>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden sm:fixed sm:left-2 sm:top-1/2 sm:-translate-y-1/2 sm:z-40 sm:flex sm:flex-col sm:gap-2 sm:bg-white/80 sm:dark:bg-gray-900/80 sm:backdrop-blur-sm sm:p-2 sm:rounded-xl sm:shadow-md sm:border sm:border-gray-100/60 sm:dark:border-gray-800/60">
        {socialLinks.map((s) => <SocialLink key={s.name} s={s} />)}
      </div>
    </>
  );
};
