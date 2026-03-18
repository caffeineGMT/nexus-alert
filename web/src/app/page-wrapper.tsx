'use client';

import { Suspense } from 'react';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Capture referral code from URL and store in localStorage
    const ref = searchParams.get('ref');
    if (ref) {
      localStorage.setItem('nexus_alert_ref', ref);
      console.log('[NEXUS Alert] Referral code captured:', ref);

      // Track referral click (increment clicks counter)
      trackReferralClick(ref);
    }
  }, [searchParams]);

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
