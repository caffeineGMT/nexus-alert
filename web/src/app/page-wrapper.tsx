'use client';

import { Suspense } from 'react';
import { useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { storeUTMParams, trackPageView, getUTMParams } from './utils/analytics';

export function ReferralTracker() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    // Store UTM parameters for attribution
    storeUTMParams();

    // Track page view with UTM parameters
    const utmParams = getUTMParams();
    let source: 'homepage' | 'nexus-page' | 'global-entry-page' | 'sentri-page' | 'pricing-page' | 'blog' = 'homepage';

    if (pathname.includes('/nexus')) source = 'nexus-page';
    else if (pathname.includes('/global-entry')) source = 'global-entry-page';
    else if (pathname.includes('/sentri')) source = 'sentri-page';
    else if (pathname.includes('/pricing') || pathname.includes('/pro')) source = 'pricing-page';
    else if (pathname.includes('/blog')) source = 'blog';

    trackPageView(pathname, source, utmParams || undefined);

    // Capture referral code from URL and store in localStorage
    const ref = searchParams.get('ref');
    if (ref) {
      localStorage.setItem('nexus_alert_ref', ref);
      console.log('[NEXUS Alert] Referral code captured:', ref);

      // Track referral click (increment clicks counter)
      trackReferralClick(ref);
    }
  }, [searchParams, pathname]);

  async function trackReferralClick(code: string) {
    try {
      // Get current referral data
      const resp = await fetch(`https://api.nexus-alert.com/api/referrals/${encodeURIComponent(code)}`);
      if (resp.ok) {
        const data = await resp.json();
        console.log('[NEXUS Alert] Referral stats:', data);
      }
    } catch (err) {
      console.error('[NEXUS Alert] Failed to track referral click:', err);
    }
  }

  return null;
}

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <ReferralTracker />
      </Suspense>
      {children}
    </>
  );
}
