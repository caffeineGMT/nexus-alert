// Error Boundary for NEXUS Alert App Routes
// Catches errors in nested route segments

'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
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
        <h2 style={{ fontSize: '20px', marginBottom: '1rem', color: '#e8e8e8' }}>
          Something went wrong
        </h2>
        <p style={{ color: '#888', marginBottom: '1.5rem' }}>
          We've logged this error and will investigate.
        </p>
        <button
          onClick={reset}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
