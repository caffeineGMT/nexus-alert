'use client';

import { useState } from 'react';

export default function PartnersPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    website: '',
    estimatedReferrals: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/partner-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Something went wrong. Please email us at partners@nexus-alert.com');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="max-w-2xl bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Received!</h1>
          <p className="text-lg text-gray-600 mb-6">
            We'll review your application and get back to you within 2 business days.
          </p>
          <p className="text-gray-500">
            Questions? Email us at partners@nexus-alert.com
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">NEXUS Alert</div>
          <a href="/" className="text-gray-600 hover:text-gray-900">
            ← Back to Home
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🤝 Partnership Program
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Earn 20% Recurring Commission
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Refer immigration lawyers to NEXUS Alert Pro and earn $19.80/month for every customer — for as long as they stay subscribed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: Program Details */}
          <div>
            <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Partner With Us?</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">20% Recurring Commission</h3>
                    <p className="text-gray-600">
                      Earn $19.80/month per Pro customer ($99/mo × 20%). Lifetime recurring revenue as long as they subscribe.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Perfect for Your Audience</h3>
                    <p className="text-gray-600">
                      If you serve immigration lawyers, consultants, or NEXUS applicants, this is a natural fit.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Real-Time Dashboard</h3>
                    <p className="text-gray-600">
                      Track referrals, conversions, and commissions in your partner dashboard. Payouts via PayPal or Stripe.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Marketing Support</h3>
                    <p className="text-gray-600">
                      We provide email templates, social media graphics, and landing pages to help you promote.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-8 text-white shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Earning Potential</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-green-400 pb-3">
                  <span>5 referrals/month</span>
                  <span className="font-bold text-xl">$99/mo</span>
                </div>
                <div className="flex justify-between items-center border-b border-green-400 pb-3">
                  <span>10 referrals/month</span>
                  <span className="font-bold text-xl">$198/mo</span>
                </div>
                <div className="flex justify-between items-center border-b border-green-400 pb-3">
                  <span>20 referrals/month</span>
                  <span className="font-bold text-xl">$396/mo</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-semibold">50 referrals/month</span>
                  <span className="font-bold text-2xl">$990/mo</span>
                </div>
              </div>
              <p className="text-sm mt-4 text-green-100">
                * Assumes all referrals stay subscribed. Actual earnings vary based on retention.
              </p>
            </div>
          </div>

          {/* Right: Application Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Apply to Become a Partner</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization/Business *
                </label>
                <input
                  type="text"
                  required
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Immigration Consulting Group"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many immigration lawyers do you reach per month?
                </label>
                <select
                  value={formData.estimatedReferrals}
                  onChange={(e) => setFormData({ ...formData, estimatedReferrals: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-100">51-100</option>
                  <option value="101-500">101-500</option>
                  <option value="500+">500+</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Submit Application
              </button>

              <p className="text-sm text-gray-500 text-center">
                We'll review your application and send you a unique referral link within 2 business days.
              </p>
            </form>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>

          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How do I get paid?</h3>
              <p className="text-gray-600">
                Commissions are paid monthly via PayPal or Stripe. Minimum payout is $50. If you earn less than $50 in a month, it rolls over to the next month.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How long do I earn commissions?</h3>
              <p className="text-gray-600">
                As long as your referral stays subscribed! If they subscribe for 2 years, you earn commissions for 2 years.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I promote to my email list?</h3>
              <p className="text-gray-600">
                Absolutely! We provide email templates you can customize and send to your audience.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do I need a website to join?</h3>
              <p className="text-gray-600">
                No. You can share your referral link via email, social media, LinkedIn, or even in-person conversations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
