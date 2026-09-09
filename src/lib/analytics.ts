const GA_ID = 'G-JJMSCRMS87';
const SCRIPT_ID = 'ga-gtag';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function loadGoogleAnalytics() {
  if (typeof window === 'undefined' || document.getElementById(SCRIPT_ID)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);

  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

export function disableGoogleAnalytics() {
  if (typeof window === 'undefined') return;
  window[`ga-disable-${GA_ID}`] = true;
  window.gtag?.('consent', 'update', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
  });
}
