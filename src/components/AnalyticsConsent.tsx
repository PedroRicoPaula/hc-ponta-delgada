import { useEffect, useState } from 'react';
import { CookieConsent } from '@/components/CookieConsent';
import { disableGoogleAnalytics, loadGoogleAnalytics } from '@/lib/analytics';
import { safeStorage } from '@/lib/safeStorage';

const CONSENT_KEY = 'cookie-consent';

export function AnalyticsConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = safeStorage.getItem(CONSENT_KEY);
    if (consent === 'rejected') return;
    loadGoogleAnalytics();
    if (!consent) setShowBanner(true);
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
