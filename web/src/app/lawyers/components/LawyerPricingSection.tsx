'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LawyerPricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const plans = [
    {
      name: 'Business',
      description: 'For small to mid-size immigration practices',
      monthlyPrice: 199,
      annualPrice: 1990,
      savings: 398,
      clients: 'Up to 50 clients',
      features: [
        'Bulk CSV client upload',
        'Monitor up to 50 clients simultaneously',
        'Check frequency: every 60 seconds',
        'Multi-channel alerts (email, SMS, Slack)',
        'Basic client portal (read-only access)',
        'Email support (24-hour response)',
        'Usage analytics dashboard',
        'API access (read-only)',
      ],
      cta: 'Start 14-Day Free Trial',
      ctaLink: '/lawyers/demo?plan=business',
      popular: false,
    },
    {
      name: 'Professional',
      description: 'For established firms with high volume',
      monthlyPrice: 399,
      annualPrice: 3990,
      savings: 798,
      clients: 'Up to 200 clients',
      features: [
        'Everything in Business, plus:',
        'Monitor up to 200 clients',
        'Check frequency: every 30 seconds',
        'Priority alert delivery (<2 sec)',
        'Advanced client portal (custom branding)',
        'Slack/Teams integration',
        'Dedicated account manager',
        'Priority support (4-hour response)',
        'Full API access (read/write)',
        'Webhook integrations',
        'Custom reporting',
      ],
      cta: 'Start 14-Day Free Trial',
      ctaLink: '/lawyers/demo?plan=professional',
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'For large firms and multi-office practices',
      monthlyPrice: null,
      annualPrice: null,
      savings: null,
      clients: '200+ clients',
      features: [
        'Everything in Professional, plus:',
        'Unlimited clients',
        'White-label branding (custom domain)',
        'Dedicated infrastructure',
        'SSO / SAML integration',
        'SOC 2 Type II compliance',
        'BAA available (HIPAA)',
        'Dedicated support engineer',
        '24/7 priority support (<1 hour)',
        'Custom SLA',
        'Onboarding & training',
        'Volume discounts (500+, 1000+ tiers)',
      ],
      cta: 'Contact Sales',
      ctaLink: 'mailto:sales@nexus-alert.com?subject=Enterprise Inquiry',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 px-6 border-t border-[#222]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Pricing for Law Firms</h2>
          <p className="text-[#888] max-w-2xl mx-auto mb-8">
            Transparent pricing based on client volume. All plans include unlimited team members.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 p-1 bg-[#111] border border-[#222] rounded-full">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
                billingCycle === 'monthly'
                  ? 'bg-[#3b82f6] text-white'
                  : 'text-[#888] hover:text-[#ededed]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
                billingCycle === 'annual'
                  ? 'bg-[#3b82f6] text-white'
                  : 'text-[#888] hover:text-[#ededed]'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-[#22c55e] text-white px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              billingCycle={billingCycle}
            />
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-[#888] text-sm mb-4">
            All plans include: Unlimited team member accounts • Unlimited programs (NEXUS, Global
            Entry, SENTRI) • Unlimited enrollment centers • 99.9% uptime SLA
          </p>
          <p className="text-[#666] text-xs">
            Need a custom plan? Contact us for volume pricing on 500+ or 1,000+ clients.
          </p>
        </div>
      </div>
    </section>
  );
}

interface Plan {
  name: string;
  description: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  savings: number | null;
  clients: string;
  features: string[];
  cta: string;
  ctaLink: string;
  popular: boolean;
}

function PricingCard({
  plan,
  billingCycle,
}: {
  plan: Plan;
  billingCycle: 'monthly' | 'annual';
}) {
  const price =
    billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

  const displayPrice = price
    ? `$${billingCycle === 'annual' ? Math.round(price / 12) : price}`
    : 'Custom';

  return (
    <div
      className={`relative rounded-2xl border p-8 ${
        plan.popular
          ? 'border-[#3b82f6] bg-gradient-to-b from-[#3b82f6]/5 to-[#111]'
          : 'border-[#222] bg-[#111]'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#3b82f6] text-white text-xs font-semibold rounded-full">
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
        <p className="text-sm text-[#888]">{plan.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">{displayPrice}</span>
          {price && (
            <span className="text-[#888] text-sm">
              /{billingCycle === 'annual' ? 'month' : 'mo'}
            </span>
          )}
        </div>
        {billingCycle === 'annual' && plan.savings && (
          <p className="text-sm text-[#22c55e] mt-1">
            Save ${plan.savings}/year
          </p>
        )}
        {billingCycle === 'annual' && price && (
          <p className="text-xs text-[#666] mt-1">
            Billed ${plan.annualPrice} annually
          </p>
        )}
        <p className="text-sm text-[#888] mt-2 font-semibold">{plan.clients}</p>
      </div>

      <Link
        href={plan.ctaLink}
        className={`block w-full text-center px-6 py-3 rounded-xl font-semibold transition mb-6 ${
          plan.popular
            ? 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'
            : 'border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white'
        }`}
      >
        {plan.cta}
      </Link>

      <div className="space-y-3">
        {plan.features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-2">
            {feature.startsWith('Everything in') ? (
              <span className="text-[#888] text-sm italic">{feature}</span>
            ) : (
              <>
                <svg
                  className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-[#ccc]">{feature}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
