import { useEffect, useState } from 'react';
import { CookieConsent } from '@/components/CookieConsent';
import { loadGoogleAnalytics } from '@/lib/analytics';
import { safeStorage } from '@/lib/safeStorage';

export function AnalyticsConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = safeStorage.getItem('cookie-consent');
    if (consent === 'accepted') {
      loadGoogleAnalytics();
      return;
    }
    if (!consent) setShowBanner(true);
  }, []);

  const accept = () => {
    safeStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
    loadGoogleAnalytics();
  };

  const reject = () => {
    safeStorage.setItem('cookie-consent', 'rejected');
    setShowBanner(false);
  };

  if (!showBanner) return null;
  return <CookieConsent onAccept={accept} onReject={reject} />;
}
