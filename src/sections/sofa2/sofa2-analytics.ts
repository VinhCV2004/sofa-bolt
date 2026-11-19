export type Sofa2AnalyticsConsent = 'granted' | 'denied' | '';

type Sofa2Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: Sofa2Gtag;
  }
}

const CONSENT_KEY = 'sofa2-analytics-consent-v1';
const measurementId = String(import.meta.env.VITE_GA4_MEASUREMENT_ID ?? '').trim();
let configured = false;

export const isSofa2AnalyticsConfigured = () => /^G-[A-Z0-9]+$/i.test(measurementId);

export const getSofa2AnalyticsConsent = (): Sofa2AnalyticsConsent => {
  if (typeof window === 'undefined') return '';
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === 'granted' || value === 'denied' ? value : '';
  } catch {
    return '';
  }
};

export const saveSofa2AnalyticsConsent = (consent: Exclude<Sofa2AnalyticsConsent, ''>) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CONSENT_KEY, consent);
  } catch {
    // Measurement stays disabled if the visitor's browser blocks storage.
  }
};

export const initializeSofa2Analytics = () => {
  if (typeof window === 'undefined' || !isSofa2AnalyticsConfigured()
    || getSofa2AnalyticsConsent() !== 'granted') return false;
  if (configured || window.gtag) return true;

  window.dataLayer = window.dataLayer ?? [];
  const gtag: Sofa2Gtag = (...args) => window.dataLayer?.push(args);
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  gtag('config', measurementId, { send_page_view: false, allow_google_signals: false });

  const scriptId = 'sofa2-google-analytics-script';
  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }
  configured = true;
  return true;
};

export const trackSofa2AnalyticsEvent = (eventName: string, params: Record<string, string | number | boolean> = {}) => {
  if (getSofa2AnalyticsConsent() !== 'granted' || !window.gtag) return;
  window.gtag('event', eventName, params);
};
