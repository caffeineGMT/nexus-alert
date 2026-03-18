'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ReferralTracker() {
  const searchParams = useSearchParams();
  const [referralBanner, setReferralBanner] = useState<string | null>(null);

  useEffect(() => {
    const ref = searchParams.get('ref');

    if (ref) {
      // Store referral code in both keys for compatibility
      localStorage.setItem('referralCode', ref);
      localStorage.setItem('nexus_alert_ref', ref);

      // Track referral click on backend
      trackReferralClick(ref);

      // Show referral discount banner
      setReferralBanner(ref);
    }
  }, [searchParams]);

  const trackReferralClick = async (code: string) => {
    try {
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
    } catch (err) {
      console.error('Failed to track referral click:', err);
    }
  };

  if (!referralBanner) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
      color: 'white',
      padding: '10px 20px',
      textAlign: 'center',
      fontSize: '14px',
      fontWeight: 600,
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    }}>
      🎉 You were referred by a friend! You&apos;ll get <span style={{ color: '#86efac' }}>50% off your first month</span> when you upgrade.
      <button
        onClick={() => setReferralBanner(null)}
        style={{
          marginLeft: '16px',
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        &times;
      </button>
    </div>
  );
}
