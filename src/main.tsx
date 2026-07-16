import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async';

// scripts/prerender.js ships real markup in #root so crawlers/link-preview
// bots get correct per-page content without running JS. We still use
// createRoot (not hydrateRoot) rather than reconcile against it: several
// sections use framer-motion's whileInView, whose "already in view at mount"
// check depends on viewport/scroll position — that legitimately differs
// between the prerender snapshot and any real visitor's viewport, which
// hydrateRoot treats as a mismatch (React error #418/#423, falls back to a
// full client re-render anyway). createRoot replaces the prerendered markup
// outright — same end result, no console errors, no dependence on animation
// state matching.
createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered:', reg))
      .catch(err => console.error('SW registration failed:', err));
  });
}
