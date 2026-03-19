'use client';

import { PageWrapper } from '../../page-wrapper';
import Link from 'next/link';
import { useState } from 'react';

export default function DemoPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    firmName: '',
    firmSize: '',
    clientVolume: '',
    currentSolution: '',
    preferredDate: '',
    preferredTime: '',
    interests: [] as string[],
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Replace with actual backend endpoint
    // For now, simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Demo request:', formData);
    setSubmitted(true);
    setLoading(false);

    // Send to backend/CRM/email
    // await fetch('/api/demo-requests', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData),
    // });
  };

  const handleCheckboxChange = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  if (submitted) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] flex items-center justify-center px-6">
          <div className="max-w-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-[#22c55e]/20 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-[#22c55e]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4">Demo Request Received!</h1>
            <p className="text-lg text-[#888] mb-8">
              Thanks for your interest, {formData.firstName}. Our team will reach out within 24
              hours to schedule your personalized demo of NEXUS Alert.
            </p>
            <div className="bg-[#111] border border-[#222] rounded-xl p-6 mb-8">
              <h2 className="font-semibold mb-4">What happens next?</h2>
              <div className="space-y-3 text-left">
                <StepItem
                  number={1}
                  text="You'll receive a confirmation email with demo details"
                />
                <StepItem
                  number={2}
                  text="A sales engineer will contact you to confirm your preferred time"
                />
                <StepItem
                  number={3}
                  text="We'll prepare a custom demo based on your firm's needs"
                />
                <StepItem
                  number={4}
                  text="30-minute live demo + Q&A with our team"
                />
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Link
                href="/lawyers"
                className="px-6 py-3 rounded-xl border border-[#3b82f6] text-[#3b82f6] font-semibold hover:bg-[#3b82f6] hover:text-white transition"
              >
                Back to Lawyers Page
              </Link>
              <Link
                href="/"
                className="px-6 py-3 rounded-xl bg-[#3b82f6] text-white font-semibold hover:bg-[#2563eb] transition"
              >
                Explore NEXUS Alert
              </Link>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
        {/* Nav */}
        <nav className="fixed top-0 w-full z-50 border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold tracking-tight">
              NEXUS Alert
            </Link>
            <Link
              href="/lawyers"
              className="text-sm text-[#888] hover:text-[#ededed] transition"
            >
              ← Back to Lawyers
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-32 pb-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Schedule Your Personalized Demo
            </h1>
            <p className="text-lg text-[#888] max-w-2xl mx-auto">
              See NEXUS Alert in action. We'll walk you through bulk client management,
              white-label options, and show you exactly how much time and money your firm can
              save.
            </p>
          </div>
        </section>

        {/* Form + Benefits */}
        <section className="pb-20 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="First Name"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                  <InputField
                    label="Last Name"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>

                <InputField
                  label="Work Email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />

                <InputField
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />

                <InputField
                  label="Law Firm Name"
                  type="text"
                  required
                  value={formData.firmName}
                  onChange={(e) =>
                    setFormData({ ...formData, firmName: e.target.value })
                  }
                />

                <SelectField
                  label="Firm Size"
                  required
                  value={formData.firmSize}
                  onChange={(e) =>
                    setFormData({ ...formData, firmSize: e.target.value })
                  }
                  options={[
                    'Solo practitioner',
                    '2-5 attorneys',
                    '6-10 attorneys',
                    '11-25 attorneys',
                    '26-50 attorneys',
                    '50+ attorneys',
                  ]}
                />

                <SelectField
                  label="Annual NEXUS/Global Entry Client Volume"
                  required
                  value={formData.clientVolume}
                  onChange={(e) =>
                    setFormData({ ...formData, clientVolume: e.target.value })
                  }
                  options={[
                    '1-25 clients',
                    '26-50 clients',
                    '51-100 clients',
                    '101-200 clients',
                    '200+ clients',
                  ]}
                />

                <SelectField
                  label="Current Appointment Monitoring Solution"
                  value={formData.currentSolution}
                  onChange={(e) =>
                    setFormData({ ...formData, currentSolution: e.target.value })
                  }
                  options={[
                    'Manual checking by staff',
                    'Using a different tool',
                    'No current solution',
                    'Other',
                  ]}
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Preferred Demo Date"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) =>
                      setFormData({ ...formData, preferredDate: e.target.value })
                    }
                  />
                  <SelectField
                    label="Preferred Time (ET)"
                    value={formData.preferredTime}
                    onChange={(e) =>
                      setFormData({ ...formData, preferredTime: e.target.value })
                    }
                    options={[
                      '9:00 AM - 10:00 AM',
                      '10:00 AM - 11:00 AM',
                      '11:00 AM - 12:00 PM',
                      '12:00 PM - 1:00 PM',
                      '1:00 PM - 2:00 PM',
                      '2:00 PM - 3:00 PM',
                      '3:00 PM - 4:00 PM',
                      '4:00 PM - 5:00 PM',
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">
                    What would you like to see in the demo? (Select all that apply)
                  </label>
                  <div className="space-y-2">
                    {[
                      'Bulk client upload & management',
                      'Client portal demo',
                      'White-label branding options',
                      'API integration capabilities',
                      'Reporting & analytics',
                      'Pricing & ROI calculation',
                    ].map((interest) => (
                      <label
                        key={interest}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(interest)}
                          onChange={() => handleCheckboxChange(interest)}
                          className="w-4 h-4 rounded border-[#333] bg-[#111] text-[#3b82f6] focus:ring-[#3b82f6]"
                        />
                        <span className="text-sm text-[#ccc]">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <TextareaField
                  label="Additional Notes or Questions"
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Tell us about your specific needs or any questions you have..."
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3.5 rounded-xl bg-[#3b82f6] text-white font-semibold hover:bg-[#2563eb] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Request Demo'}
                </button>

                <p className="text-xs text-[#666] text-center">
                  By submitting, you agree to our{' '}
                  <Link href="/privacy" className="text-[#3b82f6] hover:underline">
                    Privacy Policy
                  </Link>
                  . We'll only use your information to schedule and conduct your demo.
                </p>
              </form>
            </div>

            {/* Benefits */}
            <div>
              <div className="sticky top-24">
                <h2 className="text-2xl font-bold mb-6">What you'll get in your demo</h2>
                <div className="space-y-4 mb-8">
                  <BenefitCard
                    icon="🎯"
                    title="Personalized walkthrough"
                    description="Tailored to your firm's size, client volume, and specific needs"
                  />
                  <BenefitCard
                    icon="📊"
                    title="ROI calculation"
                    description="See exactly how much time and money NEXUS Alert will save your practice"
                  />
                  <BenefitCard
                    icon="💬"
                    title="Live Q&A"
                    description="Ask anything about features, pricing, integrations, or implementation"
                  />
                  <BenefitCard
                    icon="🚀"
                    title="Custom onboarding plan"
                    description="We'll outline exactly how to migrate your existing clients and get started"
                  />
                </div>

                <div className="bg-[#111] border border-[#222] rounded-xl p-6">
                  <h3 className="font-semibold mb-3">14-Day Free Trial Available</h3>
                  <p className="text-sm text-[#888] mb-4">
                    After your demo, start a risk-free trial with no credit card required. Test
                    with real clients before committing.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-[#22c55e]">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    No credit card required
                  </div>
                </div>

                <div className="mt-6 text-sm text-[#888]">
                  <p className="mb-2">Typical demo duration: 30 minutes</p>
                  <p>
                    Need Enterprise features (200+ clients, white-label, SSO)? Mention it in the
                    form and we'll schedule extra time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

function InputField({
  label,
  type,
  required = false,
  value,
  onChange,
}: {
  label: string;
  type: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">
        {label} {required && <span className="text-[#ef4444]">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2.5 bg-[#111] border border-[#333] rounded-lg text-[#ededed] placeholder-[#555] focus:border-[#3b82f6] focus:outline-none transition"
      />
    </div>
  );
}

function SelectField({
  label,
  required = false,
  value,
  onChange,
  options,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">
        {label} {required && <span className="text-[#ef4444]">*</span>}
      </label>
      <select
        required={required}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2.5 bg-[#111] border border-[#333] rounded-lg text-[#ededed] focus:border-[#3b82f6] focus:outline-none transition appearance-none cursor-pointer"
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextareaField({
  label,
  rows,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  rows: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-[#111] border border-[#333] rounded-lg text-[#ededed] placeholder-[#555] focus:border-[#3b82f6] focus:outline-none transition resize-none"
      />
    </div>
  );
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="text-2xl flex-shrink-0">{icon}</div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-[#888]">{description}</p>
      </div>
    </div>
  );
}

function StepItem({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-[#3b82f6] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
        {number}
      </div>
      <p className="text-sm text-[#ccc]">{text}</p>
    </div>
  );
}
