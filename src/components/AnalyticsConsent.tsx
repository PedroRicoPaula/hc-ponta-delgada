import { useEffect, useState } from 'react';
import { CookieConsent } from '@/components/CookieConsent';
import { disableGoogleAnalytics } from '@/lib/analytics';
import { safeStorage } from '@/lib/safeStorage';

const CONSENT_KEY = 'cookie-consent';

export function AnalyticsConsent() {
  const [showBanner, setShowBanner] = useState(false);

  // O GA já arrancou no index.html (mede até recusarem). Aqui só se decide o banner.
  useEffect(() => {
    if (!safeStorage.getItem(CONSENT_KEY)) setShowBanner(true);
  }, []);

  const accept = () => {
    safeStorage.setItem(CONSENT_KEY, 'accepted');
    setShowBanner(false);
  };

  const reject = () => {
    safeStorage.setItem(CONSENT_KEY, 'rejected');
    disableGoogleAnalytics();
    setShowBanner(false);
  };

  if (!showBanner) return null;
  return <CookieConsent onAccept={accept} onReject={reject} />;
}
