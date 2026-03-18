/**
 * Enhanced Analytics Tracking for NEXUS Alert
 * Comprehensive event tracking for conversion optimization
 */

export interface ScrollDepthEvent {
  depth: number;
  page: string;
  timestamp: number;
}

export interface CTAClickEvent {
  ctaType: 'primary' | 'secondary' | 'pricing' | 'exit_intent';
  ctaText: string;
  location: string;
  variant?: string;
}

export interface CheckoutEvent {
  step: 'start' | 'complete' | 'abandon' | 'error';
  plan: 'free' | 'monthly' | 'annual';
  value?: number;
  error?: string;
}

/**
 * Track scroll depth milestones
 */
export function trackScrollDepth() {
  if (typeof window === 'undefined') return;

  const milestones = [25, 50, 75, 100];
  const tracked = new Set<number>();

  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollPercent = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);

    milestones.forEach(milestone => {
      if (scrollPercent >= milestone && !tracked.has(milestone)) {
        tracked.add(milestone);

        // Google Analytics
        if ((window as any).gtag) {
          (window as any).gtag('event', 'scroll_depth', {
            depth: milestone,
            page: window.location.pathname,
          });
        }

        // Plausible
        if ((window as any).plausible) {
          (window as any).plausible('Scroll Depth', {
            props: {
              depth: milestone,
              page: window.location.pathname,
            },
          });
        }
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Cleanup function
  return () => window.removeEventListener('scroll', handleScroll);
}

/**
 * Track CTA clicks with context
 */
export function trackCTAClick(event: CTAClickEvent) {
  if (typeof window === 'undefined') return;

  // Google Analytics
  if ((window as any).gtag) {
    (window as any).gtag('event', 'cta_click', {
      cta_type: event.ctaType,
      cta_text: event.ctaText,
      location: event.location,
      variant: event.variant,
      page_url: window.location.pathname,
    });
  }

  // Plausible
  if ((window as any).plausible) {
    (window as any).plausible('CTA Click', {
      props: {
        type: event.ctaType,
        text: event.ctaText,
        location: event.location,
        variant: event.variant || 'none',
        page: window.location.pathname,
      },
    });
  }
}

/**
 * Track checkout funnel events
 */
export function trackCheckoutEvent(event: CheckoutEvent) {
  if (typeof window === 'undefined') return;

  const eventName = `checkout_${event.step}`;

  // Google Analytics
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, {
      plan: event.plan,
      value: event.value,
      error: event.error,
      page_url: window.location.pathname,
    });
  }

  // Plausible
  if ((window as any).plausible) {
    const capitalizedStep = event.step.charAt(0).toUpperCase() + event.step.slice(1);
    (window as any).plausible(`Checkout ${capitalizedStep}`, {
      props: {
        plan: event.plan,
        value: event.value?.toString() || '0',
        error: event.error || 'none',
        page: window.location.pathname,
      },
    });
  }

  // E-commerce tracking for GA4
  if (event.step === 'complete' && (window as any).gtag) {
    (window as any).gtag('event', 'purchase', {
      transaction_id: `tx_${Date.now()}`,
      value: event.value || (event.plan === 'annual' ? 49.99 : 4.99),
      currency: 'USD',
      items: [{
        item_id: `nexus_alert_${event.plan}`,
        item_name: `NEXUS Alert ${event.plan}`,
        item_category: 'subscription',
        price: event.value || (event.plan === 'annual' ? 49.99 : 4.99),
        quantity: 1,
      }],
    });
  }
}

/**
 * Track element visibility (for lazy-loaded content)
 */
export function trackElementVisibility(
  elementId: string,
  eventName: string,
  additionalProps?: Record<string, any>
) {
  if (typeof window === 'undefined') return;

  const element = document.getElementById(elementId);
  if (!element) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Google Analytics
          if ((window as any).gtag) {
            (window as any).gtag('event', eventName, {
              element_id: elementId,
              ...additionalProps,
            });
          }

          // Plausible
          if ((window as any).plausible) {
            (window as any).plausible(eventName, {
              props: {
                element: elementId,
                ...additionalProps,
              },
            });
          }

          // Disconnect after first view
          observer.disconnect();
        }
      });
    },
    { threshold: 0.5 } // Element must be 50% visible
  );

  observer.observe(element);

  return observer;
}

/**
 * Track time on page
 */
export function trackTimeOnPage() {
  if (typeof window === 'undefined') return;

  const startTime = Date.now();
  const milestones = [10, 30, 60, 120, 300]; // seconds
  const tracked = new Set<number>();

  const checkMilestones = () => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);

    milestones.forEach(milestone => {
      if (elapsed >= milestone && !tracked.has(milestone)) {
        tracked.add(milestone);

        // Google Analytics
        if ((window as any).gtag) {
          (window as any).gtag('event', 'time_on_page', {
            duration_seconds: milestone,
            page: window.location.pathname,
          });
        }

        // Plausible
        if ((window as any).plausible) {
          (window as any).plausible('Time on Page', {
            props: {
              duration: milestone,
              page: window.location.pathname,
            },
          });
        }
      }
    });
  };

  const interval = setInterval(checkMilestones, 5000); // Check every 5 seconds

  // Cleanup
  return () => clearInterval(interval);
}

/**
 * Track form abandonment
 */
export function trackFormAbandonment(formId: string, formName: string) {
  if (typeof window === 'undefined') return;

  const form = document.getElementById(formId);
  if (!form) return;

  let hasInteracted = false;
  let hasSubmitted = false;

  // Track interaction
  const handleInput = () => {
    hasInteracted = true;
  };

  // Track submission
  const handleSubmit = () => {
    hasSubmitted = true;
  };

  // Track abandonment on page unload
  const handleUnload = () => {
    if (hasInteracted && !hasSubmitted) {
      // Google Analytics
      if ((window as any).gtag) {
        (window as any).gtag('event', 'form_abandonment', {
          form_name: formName,
          form_id: formId,
          page: window.location.pathname,
        });
      }

      // Plausible
      if ((window as any).plausible) {
        (window as any).plausible('Form Abandonment', {
          props: {
            form: formName,
            page: window.location.pathname,
          },
        });
      }
    }
  };

  form.addEventListener('input', handleInput);
  form.addEventListener('submit', handleSubmit);
  window.addEventListener('beforeunload', handleUnload);

  // Cleanup
  return () => {
    form.removeEventListener('input', handleInput);
    form.removeEventListener('submit', handleSubmit);
    window.removeEventListener('beforeunload', handleUnload);
  };
}

/**
 * Track exit intent
 */
export function trackExitIntent() {
  if (typeof window === 'undefined') return;

  let tracked = false;

  const handleMouseLeave = (e: MouseEvent) => {
    if (e.clientY <= 0 && !tracked) {
      tracked = true;

      // Google Analytics
      if ((window as any).gtag) {
        (window as any).gtag('event', 'exit_intent', {
          page: window.location.pathname,
        });
      }

      // Plausible
      if ((window as any).plausible) {
        (window as any).plausible('Exit Intent', {
          props: {
            page: window.location.pathname,
          },
        });
      }
    }
  };

  document.addEventListener('mouseleave', handleMouseLeave);

  // Cleanup
  return () => document.removeEventListener('mouseleave', handleMouseLeave);
}

/**
 * Initialize all analytics tracking
 */
export function initializeAnalytics() {
  if (typeof window === 'undefined') return;

  const cleanups: (() => void)[] = [];

  // Scroll depth tracking
  const scrollCleanup = trackScrollDepth();
  if (scrollCleanup) cleanups.push(scrollCleanup);

  // Time on page tracking
  const timeCleanup = trackTimeOnPage();
  if (timeCleanup) cleanups.push(timeCleanup);

  // Exit intent tracking
  const exitCleanup = trackExitIntent();
  if (exitCleanup) cleanups.push(exitCleanup);

  // Return cleanup function
  return () => {
    cleanups.forEach(cleanup => cleanup());
  };
}
