'use client';

import dynamic from 'next/dynamic';

// Client-side only components that need ssr: false
const ExitIntentPopup = dynamic(() => import('./components/ExitIntentPopup'), { ssr: false });
const ReferralTracker = dynamic(() => import('./components/ReferralTracker'), { ssr: false });

export function ClientOnlyComponents() {
  return (
    <>
      <ExitIntentPopup />
      <ReferralTracker />
    </>
  );
}
