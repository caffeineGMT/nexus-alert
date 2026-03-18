'use client';

import { useState, useEffect } from 'react';

const freeFeatures = [
  'Monitors NEXUS, Global Entry & SENTRI',
  'Checks every 30 minutes',
  'Desktop + sound notifications',
  'Multi-location tracking',
  'Slot history & patterns',
];

const premiumFeatures = [
  'Everything in Free',
  'Checks every 2 minutes',
  'Email alerts (browser closed)',
  'SMS alerts via Twilio',
  'Priority support',
];

function CheckIcon({ green }: { green?: boolean }) {
  return (
    <svg
      className={`w-4 h-4 flex-shrink-0 ${green ? 'text-[#22c55e]' : 'text-[#555]'}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function getCountdown(): number {
  if (typeof window === 'undefined') return 23;

  const stored = localStorage.getItem('nexus_countdown');
  const lastReset = localStorage.getItem('nexus_countdown_reset');
  const today = new Date().toDateString();

  // Reset if it's a new day or no stored data
  if (!stored || !lastReset || lastReset !== today) {
    const newCount = Math.floor(Math.random() * 16) + 15; // Random 15-30
    localStorage.setItem('nexus_countdown', String(newCount));
    localStorage.setItem('nexus_countdown_reset', today);
    return newCount;
  }

  return parseInt(stored, 10);
}

type PriceVariant = 'control' | 'test';

interface PriceConfig {
  monthly: number;
  annual: number;
  annualMonthly: number;
  annualSavings: number;
}

const PRICE_CONFIGS: Record<PriceVariant, PriceConfig> = {
  control: {
    monthly: 4.99,
    annual: 49.99,
    annualMonthly: 4.16,
    annualSavings: 10,
  },
  test: {
    monthly: 9.99,
    annual: 79.99,
    annualMonthly: 6.66,
    annualSavings: 40,
  },
};

function getPriceVariant(): PriceVariant {
  if (typeof window === 'undefined') return 'control';

  // Check if variant already assigned
  const stored = localStorage.getItem('nexus_price_variant');
  if (stored === 'control' || stored === 'test') {
    return stored as PriceVariant;
  }

  // Assign variant (50/50 split)
  const variant: PriceVariant = Math.random() < 0.5 ? 'control' : 'test';
  localStorage.setItem('nexus_price_variant', variant);

  // Track assignment in Plausible
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible('Price Variant Assigned', {
      props: {
        variant: variant,
        monthly_price: PRICE_CONFIGS[variant].monthly,
        annual_price: PRICE_CONFIGS[variant].annual,
      },
    });
  }

  return variant;
}

export default function PricingSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [spotsLeft, setSpotsLeft] = useState(23);
  const [priceVariant, setPriceVariant] = useState<PriceVariant>('control');

  useEffect(() => {
    // Initialize price variant
    setPriceVariant(getPriceVariant());

    // Initialize countdown
    setSpotsLeft(getCountdown());

    // Decrement on visibility change / focus
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const current = getCountdown();
        if (current > 10) {
          const newCount = current - 1;
          setSpotsLeft(newCount);
          localStorage.setItem('nexus_countdown', String(newCount));
        }
      }
    };

    const handleFocus = () => {
      const current = getCountdown();
      if (current > 10) {
        const newCount = current - 1;
        setSpotsLeft(newCount);
        localStorage.setItem('nexus_countdown', String(newCount));
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Get referral code from localStorage (set by landing page)
      const ref = localStorage.getItem('nexus_alert_ref');

      // Store email for success page
      localStorage.setItem('nexus_alert_email', email);

      // Get UTM parameters
      const urlParams = new URLSearchParams(window.location.search);
      const source = urlParams.get('utm_source') || 'direct';
      const campaign = urlParams.get('utm_campaign') || '';

      // Get price configuration for this variant
      const priceConfig = PRICE_CONFIGS[priceVariant];
      const actualPrice = billingCycle === 'annual' ? priceConfig.annual : priceConfig.monthly;

      // Build request body
      const body: {
        email: string;
        plan: string;
        priceVariant: PriceVariant;
        ref?: string;
        utm_source?: string;
        utm_campaign?: string;
      } = {
        email,
        plan: billingCycle,
        priceVariant: priceVariant,
      };
      if (ref) {
        body.ref = ref;
      }
      if (source) {
        body.utm_source = source;
      }
      if (campaign) {
        body.utm_campaign = campaign;
      }

      // Track checkout start in Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'checkout_start', {
          source: source,
          tier: 'premium',
          billing_cycle: billingCycle,
          price_variant: priceVariant,
          price: actualPrice,
          page_url: window.location.pathname,
        });
      }

      // Track conversion event in Plausible
      if (typeof window !== 'undefined' && (window as any).plausible) {
        (window as any).plausible(
          billingCycle === 'annual' ? 'Checkout - Annual' : 'Checkout - Monthly',
          {
            props: {
              source: source,
              campaign: campaign || 'none',
              page: window.location.pathname,
              price_variant: priceVariant,
              price: actualPrice,
            },
          }
        );
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.url && data.url !== '#') {
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="pricing" className="py-20 px-6 border-t border-[#222]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-[#888] max-w-xl mx-auto mb-4">
            Start free. Upgrade when you want faster alerts and email/SMS
            notifications delivered even when your browser is closed.
          </p>
          {/* Scarcity Countdown */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#eab308]/10 to-[#f59e0b]/10 border border-[#eab308]/30 rounded-full px-4 py-2">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-semibold text-[#eab308]">
              {spotsLeft} spots left at launch price
            </span>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              billingCycle === 'monthly'
                ? 'bg-[#3b82f6] text-white'
                : 'bg-transparent text-[#888] hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition relative ${
              billingCycle === 'annual'
                ? 'bg-[#3b82f6] text-white'
                : 'bg-transparent text-[#888] hover:text-white'
            }`}
          >
            Annual
            <span className="ml-1.5 text-xs bg-[#22c55e] text-black px-2 py-0.5 rounded-full font-bold">
              Save 33%
            </span>
          </button>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free card */}
          <div className="rounded-2xl p-8 border border-[#222] bg-[#111] flex flex-col">
            <p className="text-xs uppercase tracking-widest text-[#888] font-medium mb-3">
              Free
            </p>
            <div className="flex items-end gap-1 mb-6" style={{ fontVariantNumeric: 'tabular-nums' }}>
              <span className="text-4xl font-bold">$0</span>
              <span className="text-xl text-[#888] mb-1">/mo</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-[#ccc]">
                  <CheckIcon />
                  {f}
                </li>
              ))}
            </ul>

            {/* TODO: replace with CWS URL after publishing */}
            <a
              id="cws"
              href="#cws"
              className="block w-full text-center py-2.5 rounded-lg border border-[#444] text-[#ccc] text-sm font-semibold hover:border-[#3b82f6] hover:text-white transition"
            >
              Get Started Free
            </a>
          </div>

          {/* Premium card */}
          <div className="rounded-2xl p-8 border border-[#22c55e] bg-[#111] flex flex-col relative">
            {/* Most Popular badge */}
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#22c55e] text-black text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
              Most Popular
            </span>

            <p className="text-xs uppercase tracking-widest text-[#888] font-medium mb-3">
              Premium
            </p>
            {billingCycle === 'monthly' ? (
              <div className="flex items-end gap-1 mb-6" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <span className="text-4xl font-bold">${PRICE_CONFIGS[priceVariant].monthly.toFixed(2)}</span>
                <span className="text-xl text-[#888] mb-1">/mo</span>
              </div>
            ) : (
              <div className="mb-6">
                <div className="flex items-end gap-1" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  <span className="text-4xl font-bold">${PRICE_CONFIGS[priceVariant].annual.toFixed(2)}</span>
                  <span className="text-xl text-[#888] mb-1">/year</span>
                </div>
                <div className="text-sm text-[#22c55e] mt-1 font-semibold">
                  ${PRICE_CONFIGS[priceVariant].annualMonthly.toFixed(2)}/mo — Save ${PRICE_CONFIGS[priceVariant].annualSavings}/year
                </div>
              </div>
            )}

            <ul className="space-y-3 mb-6 flex-1">
              {premiumFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-[#ccc]">
                  <CheckIcon green />
                  {f}
                </li>
              ))}
            </ul>

            {/* Urgency Banner */}
            <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-[#eab308]/10 to-[#f59e0b]/10 border border-[#eab308]/30">
              <p className="text-xs text-[#eab308] font-semibold text-center leading-relaxed">
                🔥 Limited time: Annual plan — Save ${PRICE_CONFIGS[priceVariant].annualSavings}/year with annual billing
              </p>
            </div>

            {/* Email capture + submit */}
            <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-[#0a0a0a] border border-[#333] text-sm text-[#ededed] placeholder-[#555] focus:outline-none focus:border-[#22c55e] transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-[#22c55e] text-black text-sm font-bold hover:bg-[#16a34a] disabled:opacity-60 disabled:cursor-not-allowed transition whitespace-nowrap"
              >
                {loading ? 'Processing…' : billingCycle === 'annual' ? 'Go Annual' : 'Go Premium'}
              </button>
            </form>
          </div>
        </div>

        {/* Money-back guarantee */}
        <p className="text-center text-[#555] text-sm italic mt-6">
          30-day money-back guarantee. Cancel anytime. No questions asked.
        </p>
      </div>
    </section>
  );
}
