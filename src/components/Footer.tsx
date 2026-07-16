import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Facebook, Instagram, Youtube } from 'lucide-react';
import { LegalModal } from '@/components/LegalModal';
import { DonationsModal } from '@/components/DonationsModal';

const WaveText = ({ children, hovered }: { children: string; hovered: boolean }) => (
  <>
    {children.split('').map((ch, i) => (
      <span
        key={i}
        style={{
          display: 'inline-block',
          transitionProperty: 'color, transform',
          transitionDuration: '180ms',
          transitionTimingFunction: 'ease',
          transitionDelay: `${i * 30}ms`,
          color: hovered ? '#FFC200' : undefined,
          transform: hovered ? 'scale(1.08) translateY(-1px)' : 'none',
        }}
      >
        {ch === ' ' ? ' ' : ch}
      </span>
    ))}
  </>
);

const WaveLink = ({ to, children }: { to: string; children: string }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="block text-sm text-gray-600 dark:text-gray-400"
    >
      <WaveText hovered={hovered}>{children}</WaveText>
    </Link>
  );
};

const WaveButton = ({ onClick, children }: { onClick: () => void; children: string }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="block text-sm text-gray-600 dark:text-gray-400 text-left w-full"
    >
      <WaveText hovered={hovered}>{children}</WaveText>
    </button>
  );
};

export const Footer = () => {
  const [legal, setLegal] = useState<null | 'terms' | 'privacy' | 'cookies'>(null);
  const [isDonationsOpen, setIsDonationsOpen] = useState(false);

  return (
    <>
      <footer className="bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white">
        <div className="h-1 bg-primary w-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* Logo + description */}
            <div className="space-y-4">
              <div className="group inline-flex items-center gap-3 cursor-default">
                <div className="bg-white rounded-xl p-2 inline-flex shadow-sm border border-gray-200 dark:border-transparent">
                  <img src="/uploads/pdlLogo.png" alt="HC PDL" className="h-10 w-auto" />
                </div>
                <div>
                  <p className="font-heading text-2xl font-black tracking-widest uppercase text-gray-900 dark:text-white leading-none">
                    HC PDL
                  </p>
                  <div className="max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-300 ease-out">
                    <div className="pt-1 space-y-0.5">
                      <p className="text-primary text-xs font-bold tracking-wider leading-tight">Hóquei</p>
                      <p className="text-primary text-xs font-bold tracking-wider leading-tight">Clube</p>
                      <p className="text-primary text-xs font-bold tracking-wider leading-tight">Ponta Delgada</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-500 text-sm leading-relaxed max-w-xs">
                Fundado em 2012. Representamos os Açores com paixão e orgulho no hóquei em patins nacional.
              </p>
              <div className="flex gap-2">
                {[
                  { href: "https://www.facebook.com/HoqueiClubePDL", icon: Facebook, label: "Facebook" },
                  { href: "https://www.instagram.com/hoqueiclubepdl/", icon: Instagram, label: "Instagram" },
                  { href: "https://www.youtube.com/@HoqueiClubePDL", icon: Youtube, label: "YouTube" },
                ].map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="group relative overflow-hidden w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-800 hover:border-primary transition-colors duration-300"
                  >
                    <span className="absolute inset-0 bg-primary rounded-full scale-y-0 origin-bottom transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-y-100" />
                    <Icon className="relative z-10 w-4 h-4 text-gray-500 dark:text-gray-500 transition-colors duration-200 delay-100 group-hover:text-gray-950" />
                  </a>
                ))}
              </div>
            </div>

            {/* Explorar */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-5">Explorar</p>
              <nav className="space-y-2.5">
                <WaveLink to="/blog">Blog</WaveLink>
                <WaveLink to="/patrocinadores">Patrocinadores</WaveLink>
                <WaveLink to="/modalidade">Modalidade</WaveLink>
                <WaveLink to="/comunicados">Comunicados</WaveLink>
              </nav>
            </div>

            {/* Informações + Doação */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-5">Informações</p>
              <nav className="space-y-2.5">
                <WaveButton onClick={() => setLegal('terms')}>Termos e Condições</WaveButton>
                <WaveButton onClick={() => setLegal('privacy')}>Política de Privacidade</WaveButton>
                <WaveButton onClick={() => setLegal('cookies')}>Política de Cookies</WaveButton>
              </nav>

              <button
                onClick={() => setIsDonationsOpen(true)}
                aria-label="Fazer doação ao clube"
                className="mt-6 inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-gray-950 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
              >
                <Heart className="w-4 h-4" />
                Fazer Doação
              </button>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-gray-500 dark:text-gray-600 text-xs">© 2026 Hóquei Clube Ponta Delgada. Todos os direitos reservados.</p>
            <p className="text-gray-500 dark:text-gray-600 text-xs">
              Feito por{' '}
              <a
                href="https://pedropaula.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-semibold"
              >
                Pedro Paula
              </a>
            </p>
          </div>
        </div>
      </footer>

      <LegalModal type={legal} onClose={() => setLegal(null)} />
      <DonationsModal isOpen={isDonationsOpen} onClose={() => setIsDonationsOpen(false)} />
    </>
  );
};
