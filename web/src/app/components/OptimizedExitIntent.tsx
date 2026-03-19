'use client';

import { useState, useEffect } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

const OFFERS = {
  discount: {
    emoji: '🎉',
    headline: "Wait! Special Launch Offer",
    subheadline: "Get Premium at 50% OFF",
    description: "Join in the next 10 minutes and lock in our lowest price ever — just $2.49/mo for life.",
    cta: "Claim 50% OFF Now",
    urgency: "⏰ 47 spots left at this price",
  },
  free_trial: {
    emoji: '🚀',
    headline: "Before You Go...",
    subheadline: "Try Premium Free for 14 Days",
    description: "Get 2-minute checks, email alerts, and SMS notifications. No credit card required.",
    cta: "Start Free Trial",
    urgency: "✨ No credit card • Cancel anytime",
  },
  fomo: {
    emoji: '⚡',
    headline: "Don't Miss Out!",
    subheadline: "10,000+ Users Already Finding Slots",
    description: "The average user books their appointment in 12 days. Don't wait 6 months — start today.",
    cta: "Join 10,000+ Users Free",
    urgency: "🔥 Trending #1 on ProductHunt",
  },
};

export default function OptimizedExitIntent() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [hasShown, setHasShown] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 minutes in seconds

  // Use control variant as default
  const offerVariant = 'control' as keyof typeof OFFERS;
  const offer = OFFERS[offerVariant];

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
        // Track popup shown
        if (typeof window !== 'undefined' && (window as any).plausible) {
          (window as any).plausible('Exit Intent Shown', {
            props: { trigger: 'mouse_leave' },
          });
        }
      }
    };

    // Also show after 45 seconds if user hasn't subscribed (increased from 30s)
    timeoutId = setTimeout(() => {
      if (!exitTriggered && !hasShown) {
        setHasShown(true);
        setIsVisible(true);
        // Track popup shown
        if (typeof window !== 'undefined' && (window as any).plausible) {
          (window as any).plausible('Exit Intent Shown', {
            props: { trigger: 'timeout' },
          });
        }
      }
    }, 45000);

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeoutId);
    };
  }, [hasShown]);

  // Countdown timer
  useEffect(() => {
    if (!isVisible || offerVariant !== 'discount') return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, offerVariant]);

  useEffect(() => {
    if (status === 'success') {
      localStorage.setItem('exitIntentSubscribed', 'true');
      // Track email captured
      if (typeof window !== 'undefined' && (window as any).plausible) {
        (window as any).plausible('Exit Intent Email Captured');
      }
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('exitIntentDismissed', 'true');
    // Track popup dismissed
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('Exit Intent Dismissed');
    }
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
          offer: offerVariant,
          variant: offerVariant,
        }),
      });

      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  if (!isVisible) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9998] animate-fade-in"
        onClick={handleClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="relative bg-gradient-to-br from-[#0a0a0a] via-[#0f0f14] to-[#0a0a0a] border-2 border-[#3b82f6]/50 rounded-3xl max-w-lg w-full p-8 shadow-2xl animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6]/20 to-[#8b5cf6]/20 rounded-3xl blur-xl -z-10" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-[#888] hover:text-[#ededed] transition z-10"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-4 animate-bounce-slow">{offer.emoji}</div>
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] mb-2">
              {offer.headline}
            </h2>
            <h3 className="text-2xl font-bold text-[#ededed] mb-3">
              {offer.subheadline}
            </h3>
            <p className="text-[#aaa] text-base leading-relaxed">
              {offer.description}
            </p>
          </div>

          {/* Countdown Timer (for discount variant) */}
          {offerVariant === 'discount' && countdown > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#ef4444]/20 to-[#dc2626]/20 border border-[#ef4444]/40">
              <div className="flex items-center justify-center gap-2 text-[#ef4444] font-bold text-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>Offer expires in {minutes}:{seconds.toString().padStart(2, '0')}</span>
              </div>
            </div>
          )}

          {/* Urgency Badge */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/30">
              <span className="text-sm font-semibold text-[#22c55e]">
                {offer.urgency}
              </span>
            </div>
          </div>

          {/* Success/Error Message */}
          {status === 'success' && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-[rgba(34,197,94,0.2)] border border-[#22c55e] text-[#22c55e] text-sm text-center font-semibold">
              ✓ Success! Check your email for next steps.
            </div>
          )}
          {status === 'error' && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-[rgba(239,68,68,0.2)] border border-[#ef4444] text-[#ef4444] text-sm text-center">
              Something went wrong. Please try again.
            </div>
          )}

          {/* Form */}
          {status !== 'success' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-5 py-4 rounded-xl bg-[#0a0a0a] border-2 border-[#333] text-[#ededed] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition text-base"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white font-bold text-lg hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {status === 'loading' ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    {offer.cta}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Trust Badges */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-[#666]">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#22c55e]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure checkout</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#22c55e]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#22c55e]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>10,000+ users</span>
            </div>
          </div>

          <p className="text-[#555] text-xs mt-4 text-center">
            We respect your privacy. Unsubscribe anytime with one click.
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
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
