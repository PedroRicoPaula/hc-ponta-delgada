
import { useState } from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';

export const SocialIcons = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "https://www.facebook.com/HoqueiClubePDL" },
    { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/hoqueiclubepdl/" },
    { name: "Youtube", icon: Youtube, url: "https://www.youtube.com/@HoqueiClubePDL" },
  ];

  return (
    <div 
      className={`fixed left-0 top-1/2 transform -translate-y-1/2 translate-y-8 z-40 transition-transform duration-300 ease-in-out ${isHovered ? 'translate-x-2' : '-translate-x-1'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col gap-4 bg-white/80 backdrop-blur-sm p-3 rounded-r-lg shadow-lg">
        {socialLinks.map((social) => (
          <a 
            key={social.name} 
            href={social.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`transition-all duration-300 hover:translate-x-1 p-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white ${isHovered ? 'translate-x-0' : ''}`}
            aria-label={social.name}
          >
            <social.icon size={20} />
          </a>
        ))}
      </div>
    </div>
  );
};
