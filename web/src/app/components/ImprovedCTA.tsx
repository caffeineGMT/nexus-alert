'use client';

import { useABTest } from './ABTestProvider';

interface CTAProps {
  variant?: 'primary' | 'secondary' | 'urgency' | 'social';
  location?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ImprovedCTA({
  variant = 'primary',
  location = 'unknown',
  size = 'md'
}: CTAProps) {
  const { trackConversion } = useABTest();

  const handleClick = () => {
    trackConversion('cta_click', location);

    // Track in analytics
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('CTA Click', {
        props: { variant, location },
      });
    }
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base',
    lg: 'px-8 py-4 text-lg',
  };

  // Variant-specific configurations
  const configs = {
    primary: {
      className: 'inline-flex items-center justify-center rounded-xl bg-[#3b82f6] text-white font-semibold hover:bg-[#2563eb] transition touch-manipulation shadow-lg hover:shadow-xl transform hover:scale-105',
      text: 'Install Free — Find Slots Today',
      icon: (
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2C9.14 2 6.6 3.23 4.85 5.2L8.37 11.28C8.84 9.38 10.27 8 12 8h9.46A10 10 0 0 0 12 2z" />
          <path d="M2.17 8.09A10 10 0 0 0 2 10c0 4.08 2.44 7.6 5.98 9.25L11.5 13.2C9.75 12.85 8.4 11.6 8.06 10H2.17z" />
          <path d="M12 22a10 10 0 0 0 8.64-4.97L17.1 10.9A5.97 5.97 0 0 1 18 12c0 3.31-2.69 6-6 6l-3.52 4.04A9.96 9.96 0 0 0 12 22z" />
        </svg>
      ),
    },
    secondary: {
      className: 'inline-flex items-center justify-center rounded-xl border-2 border-[#333] text-[#ededed] font-semibold hover:border-[#3b82f6] hover:text-[#3b82f6] transition touch-manipulation',
      text: 'See How It Works',
      icon: (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: '#how-it-works',
    },
    urgency: {
      className: 'inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white font-semibold hover:from-[#dc2626] hover:to-[#b91c1c] transition touch-manipulation shadow-lg hover:shadow-xl animate-pulse-slow',
      text: '🚀 Start Tracking Now — Slots Filling Fast',
      icon: null,
    },
    social: {
      className: 'inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white font-semibold hover:opacity-90 transition touch-manipulation shadow-lg hover:shadow-xl',
      text: 'Join 10,000+ Users — Free',
      icon: (
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
    },
  };

  const config = configs[variant];
  const href = config.href || 'https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID';
  const isExternal = !config.href;

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={handleClick}
      className={`${config.className} ${sizeClasses[size]}`}
    >
      {config.icon}
      {config.text}
    </a>
  );
}

// Floating CTA for bottom-right corner (sticky)
export function FloatingCTA() {
  const { trackConversion } = useABTest();

  const handleClick = () => {
    trackConversion('cta_click', 'floating_button');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden lg:block">
      <a
        href="https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#3b82f6] text-white font-semibold text-sm hover:bg-[#2563eb] transition shadow-2xl hover:shadow-3xl transform hover:scale-105 animate-bounce-slow"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2C9.14 2 6.6 3.23 4.85 5.2L8.37 11.28C8.84 9.38 10.27 8 12 8h9.46A10 10 0 0 0 12 2z" />
          <path d="M2.17 8.09A10 10 0 0 0 2 10c0 4.08 2.44 7.6 5.98 9.25L11.5 13.2C9.75 12.85 8.4 11.6 8.06 10H2.17z" />
          <path d="M12 22a10 10 0 0 0 8.64-4.97L17.1 10.9A5.97 5.97 0 0 1 18 12c0 3.31-2.69 6-6 6l-3.52 4.04A9.96 9.96 0 0 0 12 22z" />
        </svg>
        <span>Install Free</span>
        <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
      </a>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
