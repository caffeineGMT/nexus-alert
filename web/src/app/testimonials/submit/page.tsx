'use client';

import { useState } from 'react';

export default function TestimonialSubmitPage() {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    email: '',
    programType: 'NEXUS',
    originalWaitTime: '',
    foundSlotIn: '',
    testimonialText: '',
    premiumUser: 'no',
    allowMarketing: true,
    photoConsent: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/testimonials/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Failed to submit. Please try emailing us at hello@nexus-alert.com');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit. Please try emailing us at hello@nexus-alert.com');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#22c55e] to-[#3b82f6] flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">Thank you! 🎉</h1>
          <p className="text-lg text-[#888] mb-8">
            Your success story has been received. We'll review it within 24 hours
            and may reach out for follow-up questions.
          </p>
          {formData.premiumUser === 'no' && (
            <div className="p-6 rounded-xl border border-[#22c55e] bg-[#22c55e]/10 mb-6">
              <h3 className="text-xl font-semibold text-[#22c55e] mb-2">
                Your Premium Reward Code
              </h3>
              <div className="bg-[#0a0a0a] px-4 py-3 rounded-lg border border-[#22c55e] font-mono text-sm mb-3">
                THANKS-{Math.random().toString(36).substring(2, 8).toUpperCase()}
              </div>
              <p className="text-sm text-[#ccc]">
                Use this code to get <strong>3 months of Premium free</strong>.
                Check your email for redemption instructions.
              </p>
            </div>
          )}
          <a
            href="/"
            className="inline-block px-6 py-3 rounded-lg bg-[#3b82f6] text-white font-semibold hover:bg-[#2563eb] transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="text-lg font-bold tracking-tight">
            NEXUS Alert
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Share Your Success Story
          </h1>
          <p className="text-lg text-[#888] mb-8">
            Did NEXUS Alert help you find your appointment? Share your experience
            and get <strong className="text-[#22c55e]">3 months of Premium free</strong>.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="pb-20 px-6">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto p-8 rounded-xl border border-[#222] bg-[#111]"
        >
          {/* Personal Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">About You</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Name <span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0a] border border-[#333] text-[#ededed] focus:border-[#3b82f6] focus:outline-none"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Sarah Chen"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Location (City, State/Province) <span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0a] border border-[#333] text-[#ededed] focus:border-[#3b82f6] focus:outline-none"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Vancouver, BC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address <span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0a] border border-[#333] text-[#ededed] focus:border-[#3b82f6] focus:outline-none"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="your.email@example.com"
                />
                <p className="text-xs text-[#666] mt-1">
                  We'll send your Premium reward code here
                </p>
              </div>
            </div>
          </div>

          {/* Experience Details */}
          <div className="mb-8 pb-8 border-b border-[#222]">
            <h2 className="text-2xl font-bold mb-6">Your Experience</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Which program? <span className="text-[#ef4444]">*</span>
                </label>
                <select
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0a] border border-[#333] text-[#ededed] focus:border-[#3b82f6] focus:outline-none"
                  value={formData.programType}
                  onChange={(e) =>
                    setFormData({ ...formData, programType: e.target.value })
                  }
                >
                  <option value="NEXUS">NEXUS</option>
                  <option value="Global Entry">Global Entry</option>
                  <option value="SENTRI">SENTRI</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  How long was the original wait time without NEXUS Alert?
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0a] border border-[#333] text-[#ededed] focus:border-[#3b82f6] focus:outline-none"
                  value={formData.originalWaitTime}
                  onChange={(e) =>
                    setFormData({ ...formData, originalWaitTime: e.target.value })
                  }
                  placeholder="e.g., 4 months, 12 weeks"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  How quickly did you find a slot after installing NEXUS Alert?
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0a] border border-[#333] text-[#ededed] focus:border-[#3b82f6] focus:outline-none"
                  value={formData.foundSlotIn}
                  onChange={(e) =>
                    setFormData({ ...formData, foundSlotIn: e.target.value })
                  }
                  placeholder="e.g., 3 days, 1 week, same day"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Story <span className="text-[#ef4444]">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0a] border border-[#333] text-[#ededed] focus:border-[#3b82f6] focus:outline-none resize-none"
                  value={formData.testimonialText}
                  onChange={(e) =>
                    setFormData({ ...formData, testimonialText: e.target.value })
                  }
                  placeholder="Tell us about your experience... How did NEXUS Alert help you? What was it like before? What would you tell others?"
                />
                <p className="text-xs text-[#666] mt-1">
                  Aim for 2-4 sentences. Be specific about your results.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Are you currently a Premium subscriber?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="premium"
                      value="yes"
                      checked={formData.premiumUser === 'yes'}
                      onChange={(e) =>
                        setFormData({ ...formData, premiumUser: e.target.value })
                      }
                      className="w-4 h-4 accent-[#3b82f6]"
                    />
                    <span className="text-sm">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="premium"
                      value="no"
                      checked={formData.premiumUser === 'no'}
                      onChange={(e) =>
                        setFormData({ ...formData, premiumUser: e.target.value })
                      }
                      className="w-4 h-4 accent-[#3b82f6]"
                    />
                    <span className="text-sm">No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Permissions</h2>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowMarketing}
                  onChange={(e) =>
                    setFormData({ ...formData, allowMarketing: e.target.checked })
                  }
                  className="w-4 h-4 mt-0.5 accent-[#3b82f6]"
                />
                <div>
                  <div className="text-sm font-medium">
                    Permission to use testimonial on website, Chrome Web Store,
                    Product Hunt, and social media
                  </div>
                  <p className="text-xs text-[#666] mt-1">
                    We'll display your name, location, and story. We will NOT share
                    your email publicly.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.photoConsent}
                  onChange={(e) =>
                    setFormData({ ...formData, photoConsent: e.target.checked })
                  }
                  className="w-4 h-4 mt-0.5 accent-[#3b82f6]"
                />
                <div>
                  <div className="text-sm font-medium">
                    I'm willing to provide a photo (optional)
                  </div>
                  <p className="text-xs text-[#666] mt-1">
                    We'll follow up via email if you check this. Photos make
                    testimonials more engaging!
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#22c55e] text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit & Get 3 Months Free 🎁'}
          </button>

          <p className="text-xs text-[#666] text-center mt-4">
            By submitting, you agree to our{' '}
            <a href="/privacy" className="text-[#3b82f6] hover:underline">
              Privacy Policy
            </a>
            . Your reward code will be emailed within 24 hours.
          </p>
        </form>
      </section>
    </div>
  );
}
