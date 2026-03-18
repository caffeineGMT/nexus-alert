'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');

    if (ref) {
      // Store referral code in localStorage
      localStorage.setItem('referralCode', ref);

      // Track referral click
      trackReferralClick(ref);
    }
  }, [searchParams]);

  const trackReferralClick = async (code: string) => {
    try {
      // Get or generate anonymous user ID
      let userId = localStorage.getItem('anonymousUserId');
      if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem('anonymousUserId', userId);
      }

      await fetch('https://api.nexus-alert.com/api/referral/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, userId }),
      });

      console.log(`Tracked referral click for code: ${code}`);
    } catch (err) {
      console.error('Failed to track referral click:', err);
    }
  };

  return null; // This component doesn't render anything
}
