// Sentry Client Configuration for NEXUS Alert Web App
// Captures errors in the browser/client-side React components

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring
  tracesSampleRate: 0.1, // 10% of transactions for performance monitoring

  // Only send 20% of errors to save quota
  sampleRate: 0.2,

  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV || 'development',

  // Don't send errors in development
  enabled: process.env.NODE_ENV === 'production',

  // Ignore known third-party errors
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    'Loading chunk',
    'ChunkLoadError',
    /Extension context invalidated/,
    /chrome-extension/,
  ],

  // Filter out social media bots and crawlers
  beforeSend(event, hint) {
    // Don't send errors from bots
    const ua = event.request?.headers?.['user-agent'] || '';
    if (/bot|crawler|spider|crawling/i.test(ua)) {
      return null;
    }

    return event;
  },

  integrations: [
    Sentry.browserTracingIntegration({
      // Only trace important routes
      tracePropagationTargets: ['nexus-alert.com', 'api.nexus-alert.com', /^\//],
    }),
    Sentry.replayIntegration({
      // Only record 10% of sessions, but 100% of sessions with errors
      maskAllText: true,
      blockAllMedia: true,
      networkDetailAllowUrls: ['nexus-alert.com', 'api.nexus-alert.com'],
    }),
  ],

  // Session Replay sampling rates
  replaysSessionSampleRate: 0.1, // 10% of normal sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
});
