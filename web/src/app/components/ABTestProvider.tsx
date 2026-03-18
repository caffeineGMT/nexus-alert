'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { TESTS, getTestVariant, TestVariant } from '../utils/ab-testing';
import { initializeAnalytics } from '../utils/enhanced-analytics';

interface ABTestContextValue {
  heroVariant: TestVariant;
  pricingVariant: TestVariant;
  ctaVariant: TestVariant;
  trustVariant: TestVariant;
  checkoutVariant: TestVariant;
  isLoading: boolean;
}

const ABTestContext = createContext<ABTestContextValue>({
  heroVariant: 'control',
  pricingVariant: 'side_by_side',
  ctaVariant: 'control',
  trustVariant: 'control',
  checkoutVariant: 'email_then_stripe',
  isLoading: true,
});

export function useABTest() {
  return useContext(ABTestContext);
}

interface ABTestProviderProps {
  children: ReactNode;
}

export default function ABTestProvider({ children }: ABTestProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [variants, setVariants] = useState<ABTestContextValue>({
    heroVariant: 'control',
    pricingVariant: 'side_by_side',
    ctaVariant: 'control',
    trustVariant: 'control',
    checkoutVariant: 'email_then_stripe',
    isLoading: true,
  });

  useEffect(() => {
    // Assign variants for all active tests
    const heroVariant = getTestVariant(TESTS.HERO_HEADLINE);
    const pricingVariant = getTestVariant(TESTS.PRICING_LAYOUT);
    const ctaVariant = getTestVariant(TESTS.CTA_COPY);
    const trustVariant = getTestVariant(TESTS.TRUST_PLACEMENT);
    const checkoutVariant = getTestVariant(TESTS.CHECKOUT_FLOW);

    setVariants({
      heroVariant,
      pricingVariant,
      ctaVariant,
      trustVariant,
      checkoutVariant,
      isLoading: false,
    });

    setIsLoading(false);

    // Initialize analytics tracking
    const cleanup = initializeAnalytics();

    return cleanup;
  }, []);

  return (
    <ABTestContext.Provider value={variants}>
      {children}
    </ABTestContext.Provider>
  );
}
