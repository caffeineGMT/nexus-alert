'use client';

import dynamic from 'next/dynamic';

// Client-side only components that need ssr: false
const OptimizedExitIntent = dynamic(() => import('./components/OptimizedExitIntent'), { ssr: false });
const ReferralTracker = dynamic(() => import('./components/ReferralTracker'), { ssr: false });
const FloatingCTA = dynamic(() => import('./components/ImprovedCTA').then(mod => ({ default: mod.FloatingCTA })), { ssr: false });

export function ClientOnlyComponents() {
  return (
    <>
      <OptimizedExitIntent />
      <ReferralTracker />
      <FloatingCTA />
    </>
  );
}
