/**
 * A/B Testing Framework for NEXUS Alert
 * Lightweight client-side testing with localStorage persistence
 */

export type TestVariant = string;

export interface ABTest {
  name: string;
  variants: TestVariant[];
  weights?: number[]; // Optional custom weights, defaults to equal distribution
}

export interface ABTestAssignment {
  testName: string;
  variant: TestVariant;
  assignedAt: number;
}

/**
 * Get or assign a variant for a specific A/B test
 */
export function getTestVariant(test: ABTest): TestVariant {
  const storageKey = `ab_test_${test.name}`;

  // Check if user already has a variant assigned
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    try {
      const assignment: ABTestAssignment = JSON.parse(stored);
      // Validate variant still exists in current test config
      if (test.variants.includes(assignment.variant)) {
        return assignment.variant;
      }
    } catch (e) {
      // Invalid stored data, reassign
    }
  }

  // Assign new variant
  const variant = assignVariant(test);
  const assignment: ABTestAssignment = {
    testName: test.name,
    variant,
    assignedAt: Date.now(),
  };

  localStorage.setItem(storageKey, JSON.stringify(assignment));

  // Track assignment
  trackTestAssignment(test.name, variant);

  return variant;
}

/**
 * Randomly assign a variant based on weights
 */
function assignVariant(test: ABTest): TestVariant {
  const weights = test.weights || test.variants.map(() => 1 / test.variants.length);

  if (weights.length !== test.variants.length) {
    console.error('AB test weights must match number of variants');
    return test.variants[0];
  }

  const random = Math.random();
  let cumulative = 0;

  for (let i = 0; i < test.variants.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return test.variants[i];
    }
  }

  return test.variants[0]; // Fallback
}

/**
 * Track test assignment event
 */
function trackTestAssignment(testName: string, variant: TestVariant) {
  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'ab_test_assigned', {
      test_name: testName,
      variant: variant,
    });
  }

  // Plausible Analytics
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible('AB Test Assigned', {
      props: {
        test: testName,
        variant: variant,
      },
    });
  }
}

/**
 * Track conversion event for A/B test
 */
export function trackTestConversion(
  testName: string,
  conversionType: string,
  value?: number
) {
  const storageKey = `ab_test_${testName}`;
  const stored = localStorage.getItem(storageKey);

  if (!stored) {
    console.warn(`No variant assigned for test: ${testName}`);
    return;
  }

  try {
    const assignment: ABTestAssignment = JSON.parse(stored);

    // Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ab_test_conversion', {
        test_name: testName,
        variant: assignment.variant,
        conversion_type: conversionType,
        value: value,
      });
    }

    // Plausible Analytics
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('AB Test Conversion', {
        props: {
          test: testName,
          variant: assignment.variant,
          type: conversionType,
        },
      });
    }
  } catch (e) {
    console.error('Failed to track AB test conversion:', e);
  }
}

/**
 * Get all active test assignments for current user
 */
export function getAllTestAssignments(): ABTestAssignment[] {
  const assignments: ABTestAssignment[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('ab_test_')) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          assignments.push(JSON.parse(value));
        }
      } catch (e) {
        // Skip invalid entries
      }
    }
  }

  return assignments;
}

/**
 * Reset a specific test assignment (for testing purposes)
 */
export function resetTestAssignment(testName: string) {
  const storageKey = `ab_test_${testName}`;
  localStorage.removeItem(storageKey);
}

/**
 * Reset all test assignments (for testing purposes)
 */
export function resetAllTestAssignments() {
  const keys: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('ab_test_')) {
      keys.push(key);
    }
  }

  keys.forEach(key => localStorage.removeItem(key));
}

/**
 * Pre-configured tests for NEXUS Alert
 */
export const TESTS = {
  HERO_HEADLINE: {
    name: 'hero_headline',
    variants: ['control', 'variantA', 'variantB', 'variantC'],
  } as ABTest,

  PRICING_LAYOUT: {
    name: 'pricing_layout',
    variants: ['side_by_side', 'premium_first', 'single_column', 'comparison_table'],
  } as ABTest,

  CTA_COPY: {
    name: 'cta_copy',
    variants: ['control', 'action_oriented', 'outcome_focused', 'urgency_driven'],
  } as ABTest,

  TRUST_PLACEMENT: {
    name: 'trust_placement',
    variants: ['control', 'hero_integration', 'progressive_disclosure', 'sidebar'],
  } as ABTest,

  CHECKOUT_FLOW: {
    name: 'checkout_flow',
    variants: ['email_then_stripe', 'direct_stripe', 'embedded_stripe'],
  } as ABTest,
};
