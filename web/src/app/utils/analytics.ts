/**
 * Analytics and Conversion Tracking Utilities
 *
 * Centralizes all tracking events for Google Ads and Facebook Pixel
 */

// Type definitions for tracking events
export type ConversionEvent =
  | 'install_click'
  | 'email_capture'
  | 'premium_signup'
  | 'page_view'
  | 'pricing_view';

export type ConversionSource =
  | 'homepage'
  | 'nexus-page'
  | 'global-entry-page'
  | 'sentri-page'
  | 'pricing-page'
  | 'blog';

// Google Ads conversion tracking
export function trackGoogleAdsConversion(
  event: ConversionEvent,
  source: ConversionSource,
  value?: number
) {
  if (typeof window === 'undefined') return;

  const gtag = (window as any).gtag;
  if (!gtag) {
    console.warn('[Analytics] Google Ads gtag not loaded');
    return;
  }

  // Event mappings to conversion labels (update these after creating conversions in Google Ads)
  const conversionMap: Record<ConversionEvent, string> = {
    install_click: 'AW-CONVERSION_ID/INSTALL_LABEL',
    email_capture: 'AW-CONVERSION_ID/EMAIL_LABEL',
    premium_signup: 'AW-CONVERSION_ID/PREMIUM_LABEL',
    page_view: 'AW-CONVERSION_ID/PAGEVIEW_LABEL',
    pricing_view: 'AW-CONVERSION_ID/PRICING_LABEL',
  };

  gtag('event', 'conversion', {
    send_to: conversionMap[event],
    event_category: 'engagement',
    event_label: `${event}_${source}`,
    value: value || getDefaultValue(event),
    currency: 'USD',
  });

  console.log(`[Analytics] Google Ads conversion tracked: ${event} from ${source}`);
}

// Facebook Pixel event tracking
export function trackFacebookPixel(
  event: ConversionEvent,
  source: ConversionSource,
  metadata?: Record<string, any>
) {
  if (typeof window === 'undefined') return;

  const fbq = (window as any).fbq;
  if (!fbq) {
    console.warn('[Analytics] Facebook Pixel not loaded');
    return;
  }

  // Event mappings to Facebook standard events
  const eventMap: Record<ConversionEvent, string> = {
    install_click: 'Lead',
    email_capture: 'CompleteRegistration',
    premium_signup: 'Purchase',
    page_view: 'ViewContent',
    pricing_view: 'ViewContent',
  };

  const standardEvent = eventMap[event];
  const eventData = {
    source,
    action: event,
    ...metadata,
  };

  fbq('track', standardEvent, eventData);

  console.log(`[Analytics] Facebook Pixel tracked: ${standardEvent} from ${source}`);
}

// Combined tracking - fires both Google Ads and Facebook Pixel
export function trackConversion(
  event: ConversionEvent,
  source: ConversionSource,
  options?: {
    value?: number;
    metadata?: Record<string, any>;
  }
) {
  trackGoogleAdsConversion(event, source, options?.value);
  trackFacebookPixel(event, source, options?.metadata);
}

// Default conversion values for Google Ads (estimated LTV)
function getDefaultValue(event: ConversionEvent): number {
  const valueMap: Record<ConversionEvent, number> = {
    install_click: 5, // Estimated value of install (free tier)
    email_capture: 3, // Email lead value
    premium_signup: 29.94, // 6 months LTV at $4.99/mo
    page_view: 0,
    pricing_view: 2, // High intent
  };

  return valueMap[event];
}

// Track outbound link clicks
export function trackOutboundClick(
  url: string,
  source: ConversionSource,
  label: string = 'outbound_click'
) {
  if (typeof window === 'undefined') return;

  const gtag = (window as any).gtag;
  if (gtag) {
    gtag('event', label, {
      event_category: 'outbound',
      event_label: url,
      source,
    });
  }

  const fbq = (window as any).fbq;
  if (fbq) {
    fbq('trackCustom', 'OutboundClick', {
      url,
      source,
      label,
    });
  }
}

// Track email capture form submission
export function trackEmailCapture(
  email: string,
  source: ConversionSource,
  referrer?: string
) {
  trackConversion('email_capture', source, {
    metadata: {
      email_domain: email.split('@')[1],
      referrer,
      timestamp: new Date().toISOString(),
    },
  });
}

// Track premium signup (Stripe checkout)
export function trackPremiumSignup(
  userId: string,
  plan: 'monthly' | 'annual',
  revenue: number,
  source: ConversionSource
) {
  trackConversion('premium_signup', source, {
    value: revenue,
    metadata: {
      user_id: userId,
      plan,
      revenue,
      currency: 'USD',
    },
  });
}

// Track page views with UTM parameters
export function trackPageView(
  path: string,
  source: ConversionSource,
  utmParams?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
  }
) {
  if (typeof window === 'undefined') return;

  const gtag = (window as any).gtag;
  if (gtag) {
    gtag('event', 'page_view', {
      page_path: path,
      page_title: document.title,
      source,
      ...utmParams,
    });
  }

  const fbq = (window as any).fbq;
  if (fbq) {
    fbq('track', 'PageView', {
      page: path,
      source,
      ...utmParams,
    });
  }
}

// Get UTM parameters from URL
export function getUTMParams(): {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
} | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const utmParams: any = {};

  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  let hasUTM = false;

  utmKeys.forEach(key => {
    const value = params.get(key);
    if (value) {
      utmParams[key] = value;
      hasUTM = true;
    }
  });

  return hasUTM ? utmParams : null;
}

// Store UTM params in localStorage for attribution
export function storeUTMParams() {
  if (typeof window === 'undefined') return;

  const utmParams = getUTMParams();
  if (utmParams) {
    localStorage.setItem('nexus_alert_utm', JSON.stringify(utmParams));
    localStorage.setItem('nexus_alert_utm_timestamp', Date.now().toString());
  }
}

// Retrieve stored UTM params (for delayed conversion attribution)
export function getStoredUTMParams(): {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  timestamp?: number;
} | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem('nexus_alert_utm');
  const timestamp = localStorage.getItem('nexus_alert_utm_timestamp');

  if (!stored) return null;

  try {
    const params = JSON.parse(stored);
    return {
      ...params,
      timestamp: timestamp ? parseInt(timestamp) : undefined,
    };
  } catch (e) {
    return null;
  }
}

// Calculate time since first visit (for conversion delay tracking)
export function getTimeSinceFirstVisit(): number | null {
  if (typeof window === 'undefined') return null;

  const timestamp = localStorage.getItem('nexus_alert_utm_timestamp');
  if (!timestamp) return null;

  const firstVisit = parseInt(timestamp);
  const now = Date.now();
  const diffMs = now - firstVisit;

  return Math.floor(diffMs / 1000 / 60); // Return minutes
}

// Debug function - log all tracking data
export function debugTracking() {
  if (typeof window === 'undefined') return;

  console.group('🔍 Tracking Debug Info');
  console.log('Current URL:', window.location.href);
  console.log('UTM Params:', getUTMParams());
  console.log('Stored UTM:', getStoredUTMParams());
  console.log('Time Since First Visit:', getTimeSinceFirstVisit(), 'minutes');
  console.log('Google Ads loaded:', !!(window as any).gtag);
  console.log('Facebook Pixel loaded:', !!(window as any).fbq);
  console.log('Referrer:', document.referrer);
  console.groupEnd();
}

// Enable debug mode via URL param (?debug_tracking=1)
if (typeof window !== 'undefined') {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('debug_tracking') === '1') {
    debugTracking();
  }
}
