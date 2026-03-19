/**
 * Analytics utilities for conditional script loading based on user consent
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (...args: unknown[]) => void;
    $crisp?: unknown[];
    CRISP_WEBSITE_ID?: string;
    CRISP_READY_TRIGGER?: () => void;
  }
}

export const loadFacebookPixel = (pixelId: string) => {
  if (!pixelId || pixelId === 'your-fb-pixel-id-here') return;

  // Load Facebook Pixel script
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function (...args: unknown[]) {
      n.callMethod ? n.callMethod(...args) : n.queue.push(args);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode!.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  window.fbq!('init', pixelId);
  window.fbq!('track', 'PageView');
};

export const loadGoogleAds = (adsId: string) => {
  if (!adsId || adsId === 'your-google-ads-id-here') return;

  // Load Google Ads script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${adsId}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', adsId);
};

export const loadPlausible = () => {
  // Load Plausible Analytics script
  const script = document.createElement('script');
  script.defer = true;
  script.setAttribute('data-domain', 'nexus-alert.com');
  script.src = 'https://plausible.io/js/script.js';
  document.head.appendChild(script);
};

export const loadCrispChat = (websiteId: string) => {
  if (!websiteId || websiteId === 'your-crisp-website-id-here') return;

  // Initialize Crisp
  window.$crisp = [];
  window.CRISP_WEBSITE_ID = websiteId;

  const d = document;
  const s = d.createElement('script');
  s.src = 'https://client.crisp.chat/l.js';
  s.async = true;
  d.getElementsByTagName('head')[0].appendChild(s);

  // Hide on /help routes
  window.CRISP_READY_TRIGGER = function () {
    if (window.location.pathname.indexOf('/help') !== -1) {
      window.$crisp!.push(['do', 'chat:hide']);
    }
  };
};

export const loadAllAnalytics = () => {
  const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const crispWebsiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

  if (fbPixelId) loadFacebookPixel(fbPixelId);
  if (googleAdsId) loadGoogleAds(googleAdsId);
  loadPlausible();
  if (crispWebsiteId) loadCrispChat(crispWebsiteId);
};
