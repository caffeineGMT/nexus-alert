// Sentry Server Configuration for NEXUS Alert Web App
// Captures errors in Next.js server-side code (API routes, SSR, etc.)

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring
  tracesSampleRate: 0.1, // 10% of transactions

  // Error sampling - 50% for server (server errors are more critical)
  sampleRate: 0.5,

  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV || 'development',

  // Don't send errors in development
  enabled: process.env.NODE_ENV === 'production',

  // Attach more context for server errors
  integrations: [
    Sentry.httpIntegration(),
    Sentry.nativeNodeFetchIntegration(),
  ],

  beforeSend(event) {
    // Add deployment info
    event.tags = event.tags || {};
    event.tags.deployment = process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || 'unknown';

    return event;
  },
});
