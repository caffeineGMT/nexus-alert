'use client';

import { useState, useEffect } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if user has already seen or dismissed the popup
    const dismissed = localStorage.getItem('exitIntentDismissed');
    const subscribed = localStorage.getItem('exitIntentSubscribed');

    if (dismissed || subscribed) {
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let exitTriggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from the top of the viewport
      if (e.clientY <= 0 && !exitTriggered && !hasShown) {
        exitTriggered = true;
        setHasShown(true);
        setIsVisible(true);
      }
    };

    // Also show after 30 seconds if user hasn't subscribed
    timeoutId = setTimeout(() => {
      if (!exitTriggered && !hasShown) {
        setHasShown(true);
        setIsVisible(true);
      }
    }, 30000);

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeoutId);
    };
  }, [hasShown]);

  useEffect(() => {
    if (status === 'success') {
      localStorage.setItem('exitIntentSubscribed', 'true');
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('exitIntentDismissed', 'true');
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('https://api.nexus-alert.com/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'exit_intent',
          offer: 'premium_sale_50off',
        }),
      });

      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setEmail('');

      // Track in Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'exit_intent_capture', {
          email_captured: true,
        });
      }
    } catch {
      setStatus('error');
    }
  }

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] animate-fade-in"
        onClick={handleClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="relative bg-[#0a0a0a] border border-[#333] rounded-2xl max-w-md w-full p-8 shadow-2xl animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-[#888] hover:text-[#ededed] transition"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">⏰</div>
            <h2 className="text-2xl font-bold text-[#ededed] mb-3">
              Wait! Don't Miss This
            </h2>
            <p className="text-[#888] text-base">
              Get notified when <strong className="text-[#3b82f6]">Premium goes on sale</strong> — our biggest discount of the year at <strong>50% off</strong>.
            </p>
          </div>

          {/* Success/Error Message */}
          {status === 'success' && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-[rgba(34,197,94,0.15)] border border-[#22c55e] text-[#22c55e] text-sm text-center">
              ✓ You're on the VIP list! Check your email.
            </div>
          )}
          {status === 'error' && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-[rgba(239,68,68,0.15)] border border-[#ef4444] text-[#ef4444] text-sm text-center">
              Something went wrong. Please try again.
            </div>
          )}

          {/* Form */}
          {status !== 'success' && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl bg-[#111] border border-[#333] text-[#ededed] placeholder-[#555] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition text-sm"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white font-semibold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    Subscribing...
                  </>
                ) : (
                  'Notify Me of Sale'
                )}
              </button>
            </form>
          )}

          <p className="text-[#555] text-xs mt-4 text-center">
            We'll only email you about the sale. Unsubscribe anytime.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
