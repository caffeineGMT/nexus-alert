'use client';

import { useState } from 'react';

export default function WebinarPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    firmName: '',
    phone: '',
    currentClients: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Submit to backend API (you can integrate with your CRM/email list)
      const response = await fetch('/api/webinar-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);

        // Track conversion
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'webinar_registration', {
            event_category: 'lead_generation',
            event_label: 'immigration_lawyer_webinar'
          });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Something went wrong. Please try again or email us at hello@nexus-alert.com');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-2xl bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">You're Registered!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Check your email for the webinar link and calendar invite.
          </p>
          <p className="text-gray-500 mb-8">
            We'll send you the recording if you can't make it live.
          </p>
          <a
            href="/pro"
            className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Free Trial
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">NEXUS Alert</div>
          <a href="/pro" className="text-blue-600 hover:text-blue-700 font-medium">
            Skip to Free Trial →
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Webinar Details */}
          <div>
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              🎥 Free Webinar for Immigration Lawyers
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How to 10x Your Trusted Traveler Client Volume
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              Learn how immigration lawyers are automating NEXUS, Global Entry, and SENTRI appointment monitoring — saving 10+ hours/week and serving 3x more clients.
            </p>

            <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">You'll Learn:</h2>
              <ul className="space-y-3">
                {[
                  'How to monitor 20+ clients simultaneously without lifting a finger',
                  'White-label email system that brands notifications with YOUR firm name',
                  'Case study: How Sarah Chen handles 30+ NEXUS clients (vs 10 before)',
                  'Why appointment slots get booked in < 5 minutes (and how to catch them)',
                  'Integration with Clio/MyCase for seamless client workflows',
                  'Live demo of the Pro dashboard and client management'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
              <h3 className="font-semibold text-gray-900 mb-2">⏰ Next Webinar:</h3>
              <p className="text-gray-700 mb-2"><strong>Date:</strong> Every Thursday at 11 AM PT / 2 PM ET</p>
              <p className="text-gray-700 mb-2"><strong>Duration:</strong> 45 minutes + Q&A</p>
              <p className="text-gray-700"><strong>Format:</strong> Live Zoom session with screen sharing</p>
            </div>
          </div>

          {/* Right: Registration Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Register for Free Webinar</h2>
            <p className="text-gray-600 mb-6">No credit card required. Can't make it live? We'll send the recording.</p>

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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@lawfirm.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Law Firm Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firmName}
                  onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Doe Immigration Law"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many NEXUS/Global Entry clients do you currently handle?
                </label>
                <select
                  value={formData.currentClients}
                  onChange={(e) => setFormData({ ...formData, currentClients: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="0-5">0-5 clients</option>
                  <option value="6-10">6-10 clients</option>
                  <option value="11-20">11-20 clients</option>
                  <option value="21-50">21-50 clients</option>
                  <option value="50+">50+ clients</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : 'Register for Free Webinar'}
              </button>

              <p className="text-sm text-gray-500 text-center">
                By registering, you'll receive the webinar link via email. No spam, unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-16 bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What Immigration Lawyers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Saves me 10 hours/week. My clients think we're running the monitoring ourselves — it's completely white-labeled.",
                author: "Sarah Chen",
                title: "Immigration Attorney, Vancouver BC"
              },
              {
                quote: "I went from handling 10 NEXUS clients to 30+ without hiring additional staff. The ROI is insane.",
                author: "Marcus Rodriguez",
                title: "Managing Partner, Seattle Immigration Law"
              },
              {
                quote: "Catches appointments within 2 minutes. My clients book interviews 3-4 months sooner than before.",
                author: "Jennifer Park",
                title: "Immigration Lawyer, Toronto ON"
              }
            ].map((testimonial, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
