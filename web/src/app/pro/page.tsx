'use client';

import { useState } from 'react';

const proFeatures = [
  {
    title: 'Multi-Client Dashboard',
    description: 'Track appointment searches for up to 20 clients simultaneously in one centralized dashboard',
    icon: '👥',
  },
  {
    title: 'White-Label Email Notifications',
    description: 'Clients receive emails branded with your firm name, not NEXUS Alert',
    icon: '✉️',
  },
  {
    title: 'API Access',
    description: 'Programmatic client management via REST API for easy integration',
    icon: '🔌',
  },
  {
    title: 'Priority Support',
    description: '2-hour response SLA via dedicated email channel',
    icon: '⚡',
  },
  {
    title: '2-Minute Slot Checking',
    description: 'Premium monitoring frequency for all clients (vs 30-minute free tier)',
    icon: '⏱️',
  },
  {
    title: '90% Cost Savings',
    description: '$49/mo flat rate vs $4.99/client = $50+ savings for 10+ clients',
    icon: '💰',
  },
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

export default function ProPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Store email for dashboard access
      localStorage.setItem('proEmail', email);

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          plan: 'pro',
        }),
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
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="text-lg font-bold tracking-tight">
            NEXUS Alert
          </a>
          <a
            href="/"
            className="px-4 py-2 rounded-lg border border-[#444] text-[#ccc] text-sm font-semibold hover:border-[#3b82f6] hover:text-white transition"
          >
            Back to Home
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 text-sm text-[#3b82f6] mb-8">
            <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
            For Immigration Lawyers
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            NEXUS Alert Pro for{' '}
            <span className="bg-gradient-to-r from-[#3b82f6] to-[#22c55e] bg-clip-text text-transparent">
              Immigration Lawyers
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[#888] max-w-2xl mx-auto mb-10">
            Monitor 20+ clients' appointment searches simultaneously with white-label notifications
            and centralized tracking — for a flat $49/month.
          </p>

          {/* Value prop numbers */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            <div className="p-6 rounded-xl border border-[#222] bg-[#111]">
              <div className="text-4xl font-bold text-[#3b82f6] mb-2">20</div>
              <div className="text-sm text-[#888]">Clients per account</div>
            </div>
            <div className="p-6 rounded-xl border border-[#222] bg-[#111]">
              <div className="text-4xl font-bold text-[#22c55e] mb-2">90%</div>
              <div className="text-sm text-[#888]">Cost savings vs individual plans</div>
            </div>
            <div className="p-6 rounded-xl border border-[#222] bg-[#111]">
              <div className="text-4xl font-bold text-[#eab308] mb-2">2 min</div>
              <div className="text-sm text-[#888]">Slot check frequency</div>
            </div>
          </div>

          {/* CTA */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-3 mb-4">
              <input
                type="email"
                required
                placeholder="your@lawfirm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg bg-[#0a0a0a] border border-[#333] text-sm text-[#ededed] placeholder-[#555] focus:outline-none focus:border-[#3b82f6] transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-lg bg-[#3b82f6] text-white text-sm font-bold hover:bg-[#2563eb] disabled:opacity-60 disabled:cursor-not-allowed transition whitespace-nowrap"
              >
                {loading ? 'Processing…' : 'Start 60-Day Free Trial'}
              </button>
            </div>
            <p className="text-xs text-[#555]">
              No credit card required for trial. $49/month after 60 days. Cancel anytime.
            </p>
          </form>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-[#222]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Everything you need to serve your clients
          </h2>
          <p className="text-[#888] text-center max-w-xl mx-auto mb-14">
            Built specifically for immigration lawyers managing multiple NEXUS/Global Entry applicants.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {proFeatures.map(({ title, description, icon }) => (
              <div
                key={title}
                className="p-6 rounded-xl border border-[#222] bg-[#111] hover:border-[#3b82f6] transition"
              >
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-[#888] text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing comparison */}
      <section className="py-20 px-6 border-t border-[#222] bg-gradient-to-b from-[#0a0a0a] to-[#111]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Massive savings at scale
          </h2>
          <p className="text-[#888] text-center max-w-xl mx-auto mb-12">
            Compare the cost of managing 10 clients with Pro vs individual Premium subscriptions.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Individual plans */}
            <div className="p-8 rounded-2xl border border-[#444] bg-[#0a0a0a]">
              <div className="text-sm uppercase tracking-wider text-[#888] mb-4">
                Individual Plans
              </div>
              <div className="flex items-end gap-1 mb-6" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <span className="text-4xl font-bold text-[#ef4444]">$49.90</span>
                <span className="text-xl text-[#888] mb-1">/mo</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2.5 text-sm text-[#ccc]">
                  <CheckIcon />
                  10 clients × $4.99/mo each
                </li>
                <li className="flex items-center gap-2.5 text-sm text-[#ccc]">
                  <CheckIcon />
                  Each client manages own account
                </li>
                <li className="flex items-center gap-2.5 text-sm text-[#ccc]">
                  <CheckIcon />
                  Standard NEXUS Alert branding
                </li>
                <li className="flex items-center gap-2.5 text-sm text-[#ccc]">
                  <CheckIcon />
                  No centralized dashboard
                </li>
              </ul>
            </div>

            {/* Pro plan */}
            <div className="p-8 rounded-2xl border border-[#22c55e] bg-[#111] relative">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#22c55e] text-black text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                Best Value
              </span>
              <div className="text-sm uppercase tracking-wider text-[#888] mb-4">
                Pro Plan
              </div>
              <div className="flex items-end gap-1 mb-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <span className="text-4xl font-bold text-[#22c55e]">$49</span>
                <span className="text-xl text-[#888] mb-1">/mo</span>
              </div>
              <div className="text-sm text-[#22c55e] font-semibold mb-6">
                Save $0.90/mo with just 10 clients
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2.5 text-sm text-[#ccc]">
                  <CheckIcon green />
                  Up to 20 clients flat rate
                </li>
                <li className="flex items-center gap-2.5 text-sm text-[#ccc]">
                  <CheckIcon green />
                  Centralized multi-client dashboard
                </li>
                <li className="flex items-center gap-2.5 text-sm text-[#ccc]">
                  <CheckIcon green />
                  White-label firm branding
                </li>
                <li className="flex items-center gap-2.5 text-sm text-[#ccc]">
                  <CheckIcon green />
                  API access + priority support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 px-6 border-t border-[#222]">
        <div className="max-w-3xl mx-auto">
          <div className="p-8 rounded-2xl border border-[#222] bg-[#111]">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#22c55e] flex items-center justify-center text-white font-bold text-lg">
                SC
              </div>
              <div>
                <div className="font-semibold">Sarah Chen</div>
                <div className="text-sm text-[#888]">Immigration Attorney, Vancouver</div>
              </div>
            </div>
            <p className="text-[#ccc] leading-relaxed">
              "As an immigration lawyer managing 30+ NEXUS applicants, this tool saves me{' '}
              <strong className="text-white">10 hours/week</strong>. Instead of manually
              checking for each client, I just get notified the moment slots open. The white-label
              emails make it seamless — clients think we're running the monitoring ourselves."
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* Final CTA */}
      <section className="py-24 px-6 border-t border-[#222]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Start your 60-day free trial
          </h2>
          <p className="text-[#888] text-lg mb-10">
            No credit card required. See how Pro transforms your NEXUS client workflow.
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-3 mb-4">
              <input
                type="email"
                required
                placeholder="your@lawfirm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg bg-[#0a0a0a] border border-[#333] text-sm text-[#ededed] placeholder-[#555] focus:outline-none focus:border-[#3b82f6] transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-lg bg-[#3b82f6] text-white text-sm font-bold hover:bg-[#2563eb] disabled:opacity-60 disabled:cursor-not-allowed transition whitespace-nowrap"
              >
                {loading ? 'Processing…' : 'Start Free Trial'}
              </button>
            </div>
            <p className="text-xs text-[#555]">
              $49/month after trial. Cancel anytime.
            </p>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#222] text-center text-sm text-[#555]">
        <p>
          NEXUS Alert is free and open source. Not affiliated with CBP or DHS.
        </p>
        <div className="mt-3 space-x-4">
          <a
            href="/privacy"
            className="text-[#888] hover:text-[#3b82f6] transition"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-[#888] hover:text-[#3b82f6] transition"
          >
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: 'How does white-label work?',
      a: 'When slots are found for your clients, they receive emails branded with your law firm name (extracted from your email domain) instead of "NEXUS Alert". The From line shows "[YourFirm] Appointments" and the reply-to is set to your email address.',
    },
    {
      q: 'Can I add/remove clients during my subscription?',
      a: 'Yes! Add or remove clients anytime via the dashboard or API. Changes take effect immediately. You can manage up to 20 clients at any time within the $49/mo flat rate.',
    },
    {
      q: 'What happens after the 60-day trial?',
      a: 'Your card will be charged $49/month automatically. You can cancel anytime before the trial ends to avoid being charged. If you cancel during the trial, you retain access until the 60 days are up.',
    },
    {
      q: 'How does pricing compare to individual plans?',
      a: 'Individual Premium plans cost $4.99/client/mo. With 10 clients, that\'s $49.90/mo. Pro costs $49/mo flat for up to 20 clients — a 90% cost savings at 20 clients ($99.80 individual vs $49 Pro).',
    },
    {
      q: 'Can I use the API to integrate with my CRM?',
      a: 'Yes! The REST API allows you to programmatically add/remove clients and retrieve their monitoring status. Full API documentation is provided in your dashboard after signup. Common integrations include Clio, MyCase, and custom CRMs.',
    },
    {
      q: 'What\'s the 2-hour support SLA?',
      a: 'Pro subscribers get priority email support with a guaranteed 2-hour first response time during business hours (Mon-Fri 9am-5pm PT). Free and Premium tiers have best-effort support with 24-48 hour response times.',
    },
  ];

  return (
    <section className="py-20 px-6 border-t border-[#222]">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-0">
          {faqs.map(({ q, a }) => (
            <details key={q} className="border-b border-[#222] group">
              <summary className="py-4 flex justify-between items-center cursor-pointer list-none font-medium select-none">
                {q}
                <svg
                  className="w-4 h-4 flex-shrink-0 ml-4 text-[#888]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <p className="pb-4 text-[#888] text-sm leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
