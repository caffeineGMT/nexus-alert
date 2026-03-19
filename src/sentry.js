// Sentry error tracking for NEXUS Alert extension
import * as Sentry from '@sentry/browser';

let sentryInitialized = false;

/**
 * Initialize Sentry error tracking
 */
export function initSentry() {
  if (sentryInitialized) return;

  // TODO: Replace with actual Sentry DSN from https://sentry.io
  const SENTRY_DSN = process.env.SENTRY_DSN || null;

  if (!SENTRY_DSN) {
    console.warn('[Sentry] DSN not configured. Error tracking disabled.');
    return;
  }

  try {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: process.env.NODE_ENV || 'production',
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      ignoreErrors: [
        'Non-Error promise rejection captured',
        'ResizeObserver loop limit exceeded',
        'Network request failed',
      ],
      beforeSend(event, hint) {
        if (typeof chrome !== 'undefined' && chrome?.runtime?.getManifest) {
          event.contexts = event.contexts || {};
          event.contexts.app = {
            app_version: chrome.runtime.getManifest().version,
            app_name: 'NEXUS Alert Extension',
          };
        }
        return event;
      },
    });

    sentryInitialized = true;
    console.log('[Sentry] Initialized successfully');
  } catch (error) {
    console.error('[Sentry] Failed to initialize:', error);
  }
}

export function captureError(error, context = {}) {
  if (!sentryInitialized) {
    console.error('[Error]', error, context);
    return;
  }

  Sentry.captureException(error, {
    extra: context,
    tags: {
      component: context.component || 'unknown',
    },
  });
}

export function setUser(userId, userData = {}) {
  if (!sentryInitialized) return;

  Sentry.setUser({
    id: userId,
    ...userData,
  });
}

export function addBreadcrumb(message, data = {}) {
  if (!sentryInitialized) return;

  Sentry.addBreadcrumb({
    message,
    level: 'info',
    data,
  });
}

export function clearUser() {
  if (!sentryInitialized) return;
  Sentry.setUser(null);
}
