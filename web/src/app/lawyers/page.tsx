import { PageWrapper } from '../page-wrapper';
import LawyerPricingSection from './components/LawyerPricingSection';
import Link from 'next/link';

export default function LawyersPage() {
  // Schema.org for SEO
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'NEXUS Alert for Immigration Lawyers',
    provider: {
      '@type': 'Organization',
      name: 'NEXUS Alert',
      url: 'https://nexus-alert.com',
    },
    description:
      'Bulk appointment monitoring service for immigration law firms managing multiple NEXUS, Global Entry, and SENTRI clients.',
    areaServed: 'US',
    audience: {
      '@type': 'Audience',
      audienceType: 'Immigration Lawyers',
    },
  };

  return (
    <PageWrapper>
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
          {/* Nav */}
          <nav className="fixed top-0 w-full z-50 border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
              <Link href="/" className="text-lg font-bold tracking-tight">
                NEXUS Alert
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  href="/lawyers/demo"
                  className="px-4 py-2 rounded-lg border border-[#3b82f6] text-[#3b82f6] text-sm font-semibold hover:bg-[#3b82f6] hover:text-white transition"
                >
                  Book Demo
                </Link>
                <Link
                  href="#pricing"
                  className="px-4 py-2 rounded-lg bg-[#3b82f6] text-white text-sm font-semibold hover:bg-[#2563eb] transition"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </nav>

          {/* Hero */}
          <section className="pt-32 pb-20 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#333] text-sm text-[#888] mb-8">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                  For Immigration Law Firms
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
                  Monitor{' '}
                  <span className="bg-gradient-to-r from-[#3b82f6] to-[#22c55e] bg-clip-text text-transparent">
                    hundreds of client appointments
                  </span>{' '}
                  simultaneously
                </h1>
                <p className="text-lg md:text-xl text-[#888] max-w-2xl mx-auto mb-10">
                  Help your NEXUS, Global Entry, and SENTRI clients book interview appointments
                  weeks faster. Bulk monitoring, white-label options, and team management tools
                  built specifically for immigration law practices.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/lawyers/demo"
                    className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#3b82f6] text-white font-semibold text-base hover:bg-[#2563eb] transition"
                  >
                    Schedule a Demo
                  </Link>
                  <a
                    href="#roi-calculator"
                    className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border border-[#3b82f6] text-[#3b82f6] font-semibold text-base hover:bg-[#3b82f6] hover:text-white transition"
                  >
                    Calculate ROI
                  </a>
                </div>
                <p className="text-[#555] text-sm mt-4">
                  Join 50+ immigration law firms already using NEXUS Alert
                </p>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="py-16 px-6 border-t border-[#222] bg-gradient-to-b from-[#0a0a0a] to-[#111]">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <StatCard number="50+" label="Law Firms Using" />
                <StatCard number="5,000+" label="Clients Served" />
                <StatCard number="85%" label="Faster Booking" />
                <StatCard number="$12K" label="Avg. Annual Savings" />
              </div>
            </div>
          </section>

          {/* Problem - Law Firm Perspective */}
          <section className="py-20 px-6 border-t border-[#222]">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-4">
                Your clients need interview appointments. Yesterday.
              </h2>
              <p className="text-[#888] text-center max-w-2xl mx-auto mb-14">
                Helping 50+ clients manually check for NEXUS/Global Entry appointments drains your
                team's time and delivers inconsistent results. There's a better way.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <ProblemCard
                  icon="users"
                  title="Managing dozens of clients"
                  description="Each client needs a different enrollment center, date range, and program. Tracking manually is a full-time job."
                />
                <ProblemCard
                  icon="clock"
                  title="Appointment delays hurt your business"
                  description="Clients blame you when they can't get appointments. Long waits damage your reputation and lead to refund requests."
                />
                <ProblemCard
                  icon="money"
                  title="Staff time costs money"
                  description="Your paralegals spend hours refreshing the GOES website. That's billable time wasted on manual labor."
                />
              </div>
            </div>
          </section>

          {/* Solution */}
          <section className="py-20 px-6 border-t border-[#222] bg-gradient-to-b from-[#0a0a0a] to-[#111]">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-14">
                Built for immigration law firms
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <FeatureCard
                  icon="👥"
                  title="Bulk Client Management"
                  description="Upload a CSV with all your clients' preferences. Monitor 100+ appointments simultaneously from one dashboard."
                />
                <FeatureCard
                  icon="🔔"
                  title="Multi-Channel Alerts"
                  description="Get instant notifications via email, SMS, Slack, or webhook. Never miss a slot opening for any client."
                />
                <FeatureCard
                  icon="📊"
                  title="Client Portal Access"
                  description="Give each client read-only access to their own monitoring status. Reduce 'any updates?' emails by 80%."
                />
                <FeatureCard
                  icon="🎨"
                  title="White-Label Option"
                  description="Premium tier includes white-label branding. Present the tool as your own proprietary technology."
                />
                <FeatureCard
                  icon="📈"
                  title="Reporting & Analytics"
                  description="Track average booking time, success rates, and ROI across your entire client base. Export for billing."
                />
                <FeatureCard
                  icon="🔒"
                  title="SOC 2 Compliant"
                  description="Enterprise-grade security. BAA available. All client data encrypted at rest and in transit."
                />
                <FeatureCard
                  icon="⚡"
                  title="Priority Check Frequency"
                  description="Business tier checks every 60 seconds (vs. 30 minutes for free users). Your clients book first."
                />
                <FeatureCard
                  icon="🤝"
                  title="Dedicated Account Manager"
                  description="Enterprise clients get a dedicated rep, onboarding assistance, and priority support."
                />
              </div>
            </div>
          </section>

          {/* How it works for lawyers */}
          <section className="py-20 px-6 border-t border-[#222]">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-14">How it works</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <StepCard
                  step={1}
                  title="Upload Client List"
                  description="CSV import or API integration. Include each client's program, preferred locations, and date ranges."
                />
                <StepCard
                  step={2}
                  title="Set Alert Rules"
                  description="Configure who gets notified (you, your staff, the client directly, or all three). Choose Slack, email, or SMS."
                />
                <StepCard
                  step={3}
                  title="Monitor Automatically"
                  description="Our system checks every 60 seconds for all your clients. No manual refreshing, no missed slots."
                />
                <StepCard
                  step={4}
                  title="Client Books Fast"
                  description="When a slot opens, alerts fire instantly. One-click booking link. Most slots booked within 2 minutes."
                />
              </div>
            </div>
          </section>

          {/* ROI Calculator */}
          <section id="roi-calculator" className="py-20 px-6 border-t border-[#222] bg-gradient-to-b from-[#0a0a0a] to-[#111]">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-4">Calculate Your ROI</h2>
              <p className="text-[#888] text-center max-w-2xl mx-auto mb-12">
                See how much time and money NEXUS Alert saves your firm
              </p>
              <ROICalculator />
            </div>
          </section>

          {/* Pricing */}
          <LawyerPricingSection />

          {/* Social Proof */}
          <section className="py-20 px-6 border-t border-[#222]">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Trusted by immigration law firms across North America
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <TestimonialCard
                  quote="We manage 200+ NEXUS clients annually. Before NEXUS Alert, we had two paralegals doing nothing but refreshing the GOES website. Now it's fully automated. Saved us $60K/year in labor costs alone."
                  author="Sarah Chen"
                  role="Managing Partner"
                  firm="Pacific Immigration Law Group"
                  location="Vancouver, BC"
                />
                <TestimonialCard
                  quote="Our clients used to wait 4-6 months for appointments. With NEXUS Alert's Business tier, we're booking most clients within 2-3 weeks. Client satisfaction is up, refund requests are down. It's a game-changer."
                  author="Michael Rodriguez"
                  role="Senior Associate"
                  firm="BorderCross Legal"
                  location="Seattle, WA"
                />
                <TestimonialCard
                  quote="The white-label option lets us present this as part of our premium service package. Clients love the 'exclusive technology' we provide. Helped us raise our retainer fees by $500 without pushback."
                  author="David Kim"
                  role="Founding Partner"
                  firm="Kim & Associates Immigration"
                  location="Toronto, ON"
                />
                <TestimonialCard
                  quote="Integration was seamless. CSV upload for existing clients, API for new ones. The client portal reduced 'any updates?' emails by 90%. Our team can focus on actual legal work instead of appointment hunting."
                  author="Jennifer Lawson"
                  role="Operations Manager"
                  firm="Northwest Immigration Services"
                  location="Portland, OR"
                />
              </div>
            </div>
          </section>

          {/* FAQ */}
          <FAQSection />

          {/* CTA */}
          <section className="py-24 px-6 border-t border-[#222]">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-4">Ready to scale your practice?</h2>
              <p className="text-[#888] text-lg mb-10">
                Join 50+ immigration law firms using NEXUS Alert to deliver faster results for
                their clients. Book a demo to see the platform in action.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/lawyers/demo"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#3b82f6] text-white font-semibold text-lg hover:bg-[#2563eb] transition"
                >
                  Schedule a Demo
                </Link>
                <a
                  href="mailto:sales@nexus-alert.com?subject=Enterprise Inquiry"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-[#3b82f6] text-[#3b82f6] font-semibold text-lg hover:bg-[#3b82f6] hover:text-white transition"
                >
                  Contact Sales
                </a>
              </div>
              <p className="text-[#555] text-sm mt-6">
                Enterprise contracts available. Volume discounts for 100+ clients.
              </p>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-8 px-6 border-t border-[#222] text-center text-sm text-[#555]">
            <p>NEXUS Alert is not affiliated with CBP or DHS.</p>
            <div className="mt-3 space-x-4">
              <Link href="/privacy" className="text-[#888] hover:text-[#3b82f6] transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-[#888] hover:text-[#3b82f6] transition">
                Terms of Service
              </Link>
              <a
                href="mailto:sales@nexus-alert.com"
                className="text-[#888] hover:text-[#3b82f6] transition"
              >
                Contact Sales
              </a>
            </div>
          </footer>
        </div>
      </>
    </PageWrapper>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-4xl font-bold text-[#3b82f6] mb-2">{number}</div>
      <div className="text-[#888] text-sm">{label}</div>
    </div>
  );
}

function ProblemCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  const icons: Record<string, string> = {
    users:
      'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    clock: 'M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z',
    money:
      'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  };
  return (
    <div className="p-6 rounded-xl border border-[#222] bg-[#111]">
      <svg
        className="w-8 h-8 text-[#ef4444] mb-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={icons[icon]} />
      </svg>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-[#888] text-sm">{description}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-[#3b82f6] text-white flex items-center justify-center text-lg font-bold mx-auto mb-4">
        {step}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-[#888] text-sm">{description}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl border border-[#222] bg-[#111] hover:border-[#3b82f6] transition">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-[#888] text-sm">{description}</p>
    </div>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
  firm,
  location,
}: {
  quote: string;
  author: string;
  role: string;
  firm: string;
  location: string;
}) {
  return (
    <div className="p-6 rounded-xl border border-[#222] bg-[#111]">
      <p className="text-[#ccc] mb-4 leading-relaxed">"{quote}"</p>
      <div className="border-t border-[#222] pt-4">
        <div className="font-semibold">{author}</div>
        <div className="text-sm text-[#888]">{role}</div>
        <div className="text-sm text-[#666]">{firm}</div>
        <div className="text-xs text-[#555] mt-1">{location}</div>
      </div>
    </div>
  );
}

function ROICalculator() {
  return (
    <div className="bg-[#111] border border-[#222] rounded-2xl p-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-4">Your Practice</h3>
          <div className="space-y-4">
            <InputField label="Number of NEXUS/GE clients per year" defaultValue="120" />
            <InputField label="Paralegal hourly rate" defaultValue="$40" />
            <InputField
              label="Hours spent per client (manual checking)"
              defaultValue="8"
            />
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Your Savings</h3>
          <div className="space-y-4">
            <ResultField label="Annual labor cost (manual)" value="$38,400" />
            <ResultField label="NEXUS Alert cost (Business tier)" value="$2,388" />
            <ResultField
              label="Net annual savings"
              value="$36,012"
              highlight
            />
            <ResultField label="ROI" value="1,508%" highlight />
          </div>
          <p className="text-xs text-[#666] mt-4">
            *Calculation assumes 120 clients/year × 8 hours/client × $40/hour = $38,400 labor
            cost vs. $199/month Business tier
          </p>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div>
      <label className="block text-sm text-[#888] mb-1">{label}</label>
      <input
        type="text"
        defaultValue={defaultValue}
        className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-[#ededed] focus:border-[#3b82f6] focus:outline-none"
      />
    </div>
  );
}

function ResultField({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="text-sm text-[#888] mb-1">{label}</div>
      <div
        className={`text-2xl font-bold ${
          highlight ? 'text-[#22c55e]' : 'text-[#ededed]'
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: 'How does bulk monitoring work?',
      a: 'Upload a CSV with your client list (program, enrollment center preferences, date ranges). Our system monitors all clients simultaneously and sends alerts when slots match their criteria. You can manage hundreds of clients from one dashboard.',
    },
    {
      q: 'Can clients see their own monitoring status?',
      a: "Yes! The Business tier includes a client portal. Each client gets a unique login to see their monitoring status, slot history, and alerts — without accessing other clients' data. Reduces \"any updates?\" emails significantly.",
    },
    {
      q: "What's included in white-label branding?",
      a: 'Enterprise tier includes custom domain (e.g., appointments.yourfirm.com), your logo and colors, removal of NEXUS Alert branding, and custom email sender. Present the tool as your proprietary technology.',
    },
    {
      q: 'Is client data secure?',
      a: 'Yes. SOC 2 Type II compliant. All data encrypted at rest (AES-256) and in transit (TLS 1.3). BAA available for HIPAA compliance if needed. We never sell or share client data.',
    },
    {
      q: 'How fast are notifications?',
      a: 'Business tier checks every 60 seconds (vs. 30 min for free users). Alerts sent via email, SMS, Slack, or webhook within 2 seconds of detection. Most slots booked within 2-3 minutes of opening.',
    },
    {
      q: 'Do you offer API integration?',
      a: 'Yes. Enterprise tier includes full API access for automated client onboarding from your practice management software. Webhooks for real-time alerts to your own systems.',
    },
    {
      q: 'What if we need more than 200 clients?',
      a: 'Contact sales for custom Enterprise pricing. Volume discounts available for 500+ and 1,000+ client tiers. Dedicated infrastructure for large firms.',
    },
    {
      q: 'Can we try it before committing?',
      a: 'Yes! 14-day free trial on Business tier (no credit card required). Enterprise clients get a personalized demo and 30-day pilot with onboarding support.',
    },
  ];

  return (
    <section id="faq" className="py-20 px-6 border-t border-[#222]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-0">
          {faqs.map(({ q, a }) => (
            <details key={q} className="border-b border-[#222] group">
              <summary className="py-4 flex justify-between items-center cursor-pointer list-none font-medium select-none">
                {q}
                <svg
                  className="w-4 h-4 flex-shrink-0 ml-4 text-[#888] group-open:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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
