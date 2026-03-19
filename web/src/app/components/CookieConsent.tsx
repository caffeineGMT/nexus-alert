'use client';

import { useEffect, useState } from 'react';
import CookieConsent from 'react-cookie-consent';
import { loadAllAnalytics } from '@/utils/analytics';

const COOKIE_NAME = 'nexus-alert-cookie-consent';

export default function CookieConsentBanner() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Check if user has already consented
    const consent = localStorage.getItem(COOKIE_NAME);
    if (consent === 'true') {
      loadAllAnalytics();
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_NAME, 'true');
    loadAllAnalytics();
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_NAME, 'false');
    // Do not load any tracking scripts
  };

  // Only render on client to avoid hydration issues
  if (!isClient) return null;

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept All"
      declineButtonText="Decline"
      enableDeclineButton
      onAccept={handleAccept}
      onDecline={handleDecline}
      cookieName={COOKIE_NAME}
      style={{
        background: '#111',
        borderTop: '1px solid #222',
        padding: '1rem 2rem',
        alignItems: 'center',
      }}
      buttonStyle={{
        background: '#3b82f6',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600',
        borderRadius: '8px',
        padding: '10px 24px',
        border: 'none',
        cursor: 'pointer',
      }}
      declineButtonStyle={{
        background: 'transparent',
        color: '#888',
        fontSize: '14px',
        fontWeight: '600',
        borderRadius: '8px',
        padding: '10px 24px',
        border: '1px solid #333',
        cursor: 'pointer',
      }}
      contentStyle={{
        flex: '1 0 300px',
        margin: '0',
        color: '#ededed',
      }}
      expires={365}
    >
      <span style={{ fontSize: '14px', lineHeight: '1.5' }}>
        We use cookies and similar technologies to improve your experience and
        analyze our traffic.{' '}
        <a
          href="/privacy"
          style={{
            color: '#3b82f6',
            textDecoration: 'underline',
          }}
        >
          Learn more in our Privacy Policy
        </a>
        .
      </span>
    </CookieConsentBanner>
  );
}
