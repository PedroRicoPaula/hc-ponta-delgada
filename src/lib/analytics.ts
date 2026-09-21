// O gtag.js é carregado estaticamente no index.html — não injectar daqui.
// Ver o comentário no index.html: injectar em runtime partia a medição por causa
// do snapshot do scripts/prerender.js.
const GA_ID = 'G-JJMSCRMS87';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function disableGoogleAnalytics() {
  if (typeof window === 'undefined') return;
  window[`ga-disable-${GA_ID}`] = true;
  window.gtag?.('consent', 'update', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
  });
}
