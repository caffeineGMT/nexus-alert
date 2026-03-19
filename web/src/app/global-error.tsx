// Global Error Boundary for NEXUS Alert Web App
// Catches React component errors and reports to Sentry

'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#e8e8e8',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '2rem',
      }}>
        <div style={{
          maxWidth: '500px',
          textAlign: 'center',
          padding: '2rem',
          background: '#141414',
          borderRadius: '12px',
          border: '1px solid #2a2a2a',
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '1rem' }}>
            Oops! Something went wrong
          </h1>
          <p style={{ color: '#888', marginBottom: '1.5rem' }}>
            We've been notified about this issue and are working on a fix.
          </p>
          <button
            onClick={reset}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              marginRight: '8px',
            }}
          >
            Try Again
          </button>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              color: '#888',
              textDecoration: 'none',
              borderRadius: '8px',
              border: '1px solid #2a2a2a',
            }}
          >
            Go Home
          </a>
        </div>
      </body>
    </html>
  );
}
