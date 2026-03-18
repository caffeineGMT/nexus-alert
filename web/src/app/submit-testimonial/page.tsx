'use client';

import { useState } from 'react';

export default function SubmitTestimonialPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    program: 'NEXUS',
    timeToFind: '',
    enrollmentCenter: '',
    appointmentDate: '',
    previousWaitTime: '',
    story: '',
    permissionToShare: false,
    tier: 'free',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://nexus-alert-backend.YOUR_SUBDOMAIN.workers.dev/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit testimonial');
      }

      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again or email us directly at hello@nexus-alert.com');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#22c55e] flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Thank you!</h1>
          <p className="text-[#888] mb-6">
            We received your testimonial. We'll review it and get back to you within 24 hours with your Premium access code.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-[#3b82f6] hover:bg-[#2563eb] rounded-lg font-semibold transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Share Your Success Story</h1>
          <p className="text-[#888]">
            Help others discover NEXUS Alert by sharing how it helped you find your appointment. As a thank you, we'll give you <strong className="text-[#22c55e]">3 months of Premium free</strong> ($15 value).
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="p-6 rounded-xl border border-[#222] bg-[#111]">
            <h2 className="text-xl font-semibold mb-4">Your Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg focus:outline-none focus:border-[#3b82f6]"
                  placeholder="Sarah Chen"
                />
                <p className="text-xs text-[#666] mt-1">We may use your first name + last initial (e.g., Sarah C.)</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg focus:outline-none focus:border-[#3b82f6]"
                  placeholder="sarah@example.com"
                />
                <p className="text-xs text-[#666] mt-1">For sending your Premium access code</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg focus:outline-none focus:border-[#3b82f6]"
                  placeholder="Vancouver, BC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Program *</label>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg focus:outline-none focus:border-[#3b82f6]"
                >
                  <option value="NEXUS">NEXUS</option>
                  <option value="Global Entry">Global Entry</option>
                  <option value="SENTRI">SENTRI</option>
                </select>
              </div>
            </div>
          </div>

          {/* Success Details */}
          <div className="p-6 rounded-xl border border-[#222] bg-[#111]">
            <h2 className="text-xl font-semibold mb-4">Your Success Story</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">How long after installing did you find a slot? *</label>
                <input
                  type="text"
                  name="timeToFind"
                  value={formData.timeToFind}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg focus:outline-none focus:border-[#3b82f6]"
                  placeholder="3 days"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Enrollment Center</label>
                <input
                  type="text"
                  name="enrollmentCenter"
                  value={formData.enrollmentCenter}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg focus:outline-none focus:border-[#3b82f6]"
                  placeholder="Blaine, WA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Appointment Date (approximate)</label>
                <input
                  type="text"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg focus:outline-none focus:border-[#3b82f6]"
                  placeholder="March 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">How much earlier than the original "next available" date?</label>
                <input
                  type="text"
                  name="previousWaitTime"
                  value={formData.previousWaitTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg focus:outline-none focus:border-[#3b82f6]"
                  placeholder="4 months earlier"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Experience (2-3 sentences) *</label>
                <textarea
                  name="story"
                  value={formData.story}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg focus:outline-none focus:border-[#3b82f6]"
                  placeholder="I was checking manually for weeks with no luck. Installed NEXUS Alert on Friday, got notified Sunday morning, and booked for next week. This saved me months of waiting!"
                />
                <p className="text-xs text-[#666] mt-1">
                  Include: what you tried before, how NEXUS Alert helped, emotional impact
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Which tier did you use?</label>
                <select
                  name="tier"
                  value={formData.tier}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg focus:outline-none focus:border-[#3b82f6]"
                >
                  <option value="free">Free (30-minute checks)</option>
                  <option value="premium">Premium ($4.99/mo)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Permission */}
          <div className="p-6 rounded-xl border border-[#222] bg-[#111]">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="permissionToShare"
                checked={formData.permissionToShare}
                onChange={handleChange}
                required
                className="mt-1 w-5 h-5 rounded border-[#222] bg-[#0a0a0a] checked:bg-[#3b82f6]"
              />
              <span className="text-sm text-[#ccc]">
                I give permission to share my testimonial on the NEXUS Alert website, Chrome Web Store listing, and marketing materials. My full name will be shortened to first name + last initial (e.g., Sarah C.) unless I specify otherwise. *
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-8 py-4 bg-gradient-to-r from-[#3b82f6] to-[#22c55e] hover:opacity-90 rounded-lg font-bold text-lg transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit & Get 3 Months Premium Free'}
          </button>

          <p className="text-xs text-[#666] text-center">
            By submitting, you'll receive a Premium access code via email within 24 hours.
          </p>
        </form>
      </div>
    </div>
  );
}
