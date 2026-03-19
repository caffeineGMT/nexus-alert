// NEXUS Alert — Analytics Module (Lazy Loaded)
// Sentry error tracking and performance monitoring

import { initSentry, captureError, setUser } from './sentry.js';

let initialized = false;

export function init(userEmail = null) {
  if (initialized) return;

  try {
    // Initialize Sentry
    initSentry();
    initialized = true;

    // Set user context if email available
    if (userEmail) {
      setUser({ email: userEmail });
    }

    console.log('[Analytics] Initialized');
  } catch (err) {
    console.error('[Analytics] Init failed:', err);
  }
}

export function trackError(error, context = {}) {
  if (!initialized) {
    console.error('[Analytics] Not initialized, cannot track error:', error);
    return;
  }

  try {
    captureError(error, context);
  } catch (err) {
    console.error('[Analytics] Failed to track error:', err);
  }
}

export function sendPerformanceMetrics(metrics) {
  // Send to backend analytics (if implemented)
  console.log('[Analytics] Performance metrics:', metrics);

  // You could send to your backend here:
  // fetch('https://api.nexus-alert.com/analytics/performance', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ type: 'popup-performance', metrics })
  // });
}

// Auto-initialize on import
init();

// Make available globally
window.trackError = trackError;
window.sendPerformanceMetrics = sendPerformanceMetrics;
