import PricingSection from '../components/PricingSection';
import EmailCaptureForm from "../components/EmailCaptureForm";
import ActivityFeed from '../components/ActivityFeed';
import UserStats from '../components/UserStats';
import Testimonials from '../components/Testimonials';
import { PageWrapper } from '../page-wrapper';

export default function NexusPage() {
  return (
    <PageWrapper>
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">NEXUS Alert</span>
          {/* TODO: replace EXTENSION_ID after Chrome Web Store publishing */}
          <a
            href="https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-[#3b82f6] text-white text-sm font-semibold hover:bg-[#2563eb] transition"
          >
            Install Free
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#333] text-sm text-[#888] mb-8">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            Free Chrome Extension
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Never miss a{" "}
            <span className="bg-gradient-to-r from-[#3b82f6] to-[#22c55e] bg-clip-text text-transparent">
              NEXUS appointment
            </span>{" "}
            again
          </h1>
          <p className="text-lg md:text-xl text-[#888] max-w-2xl mx-auto mb-10">
            Monitor NEXUS appointments at US-Canada border locations. Get instant notifications
            when interview slots open up — so you can book it before anyone else.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* TODO: replace EXTENSION_ID after Chrome Web Store publishing */}
            <a
              href="https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID?utm_source=nexus-page"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#3b82f6] text-white font-semibold text-base hover:bg-[#2563eb] transition"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'conversion', {
                    'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
                    'event_category': 'engagement',
                    'event_label': 'install_click_nexus'
                  });
                }
                if (typeof window !== 'undefined' && (window as any).fbq) {
                  (window as any).fbq('track', 'Lead', { source: 'nexus-page', action: 'install_click' });
                }
              }}
            >
              <ChromeLogoSVG />
              Add to Chrome — Free
            </a>
          </div>
          <p className="text-[#555] text-xs mt-2">Works on Chrome, Edge, and Brave</p>
          <EmailCaptureForm />
        </div>
      </section>

      {/* Social Proof - Activity Feed */}
      <section className="py-16 px-6 border-t border-[#222] bg-gradient-to-b from-[#0a0a0a] to-[#111]">
        <ActivityFeed />
        <UserStats />
      </section>

      {/* Problem */}
      <section className="py-20 px-6 border-t border-[#222]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Appointment slots disappear in minutes
          </h2>
          <p className="text-[#888] text-center max-w-2xl mx-auto mb-14">
            NEXUS slots are released when someone cancels.
            They show up randomly and get booked almost instantly. Refreshing
            the website over and over is exhausting — and you still miss most
            of them.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <ProblemCard
              icon="clock"
              title="Slots vanish fast"
              description="Cancelled appointments get snapped up within minutes. If you're not looking at the exact right moment, you lose it."
            />
            <ProblemCard
              icon="refresh"
              title="Manual checking is painful"
              description="There's no official notification system. You have to keep refreshing the GOES website yourself, hoping to get lucky."
            />
            <ProblemCard
              icon="calendar"
              title="Wait times are months"
              description="The next available slot might be 3-6 months away. But cancellations create openings much sooner — if you catch them."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6 border-t border-[#222]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14">
            How NEXUS Alert works for NEXUS
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              step={1}
              title="Pick your locations"
              description="Select which NEXUS enrollment centers you want to monitor at US-Canada border locations."
            />
            <StepCard
              step={2}
              title="Set your preferences"
              description="Filter by date range and time of day. Set how often to check — every 1, 3, 5, or 10 minutes."
            />
            <StepCard
              step={3}
              title="Get notified instantly"
              description="When a slot opens, you get a desktop notification with a sound alert. One click takes you straight to booking."
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-[#222]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Everything you need
          </h2>
          <p className="text-[#888] text-center max-w-xl mx-auto mb-14">
            Built to make sure you never miss another opening.
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            <FeatureCard
              title="Real-time monitoring"
              description="Checks for new slots as often as every minute, running silently in the background while you work."
            />
            <FeatureCard
              title="Sound alerts"
              description="Hear a chime the moment a slot appears. No need to keep watching — just listen for the notification."
            />
            <FeatureCard
              title="Smart filters"
              description="Only get alerted for dates and times that work for you. Morning slots only? Weekdays? You choose."
            />
            <FeatureCard
              title="Multi-location tracking"
              description="Monitor multiple enrollment centers at once. Find the first available slot across all your preferred locations."
            />
            <FeatureCard
              title="One-click booking"
              description="Jump directly to the GOES booking page from any notification. The faster you act, the better your chances."
            />
            <FeatureCard
              title="Slot history"
              description="See every slot that's appeared over time. Track patterns and know when cancellations are most common."
            />
            <FeatureCard
              title="Auto-open booking"
              description="Optionally have the booking page open automatically when a slot is found. No clicks needed."
            />
            <FeatureCard
              title="Email notifications"
              description="With the optional backend, get email alerts even when your browser is closed. Never miss a slot."
            />
          </div>
        </div>
      </section>

      <PricingSection />

      <FAQSection />

      <Testimonials />

      {/* Programs */}
      <section className="py-20 px-6 border-t border-[#222]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Works with all programs</h2>
          <p className="text-[#888] max-w-xl mx-auto mb-12">
            Monitor any Trusted Traveler Program managed through the GOES
            system.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ProgramBadge name="NEXUS" description="US-Canada border" />
            <ProgramBadge name="Global Entry" description="US customs fast-track" />
            <ProgramBadge name="SENTRI" description="US-Mexico border" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-[#222]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Stop refreshing. Start booking.
          </h2>
          <p className="text-[#888] text-lg mb-10">
            Install NEXUS Alert and let it watch for NEXUS openings while you live
            your life. Completely free, no account needed.
          </p>
          {/* TODO: replace EXTENSION_ID after Chrome Web Store publishing */}
          <a
            href="https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID?utm_source=nexus-page"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#3b82f6] text-white font-semibold text-lg hover:bg-[#2563eb] transition"
            onClick={() => {
              if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'conversion', {
                  'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
                  'event_category': 'engagement',
                  'event_label': 'install_click_nexus_cta'
                });
              }
              if (typeof window !== 'undefined' && (window as any).fbq) {
                (window as any).fbq('track', 'Lead', { source: 'nexus-page', action: 'install_click_cta' });
              }
            }}
          >
            <ChromeLogoSVG />
            Install NEXUS Alert — Free
          </a>
          <p className="text-[#555] text-xs mt-2">Works on Chrome, Edge, and Brave</p>
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
          <a
            href="https://github.com/caffeineGMT/nexus-alert"
            className="text-[#888] hover:text-[#3b82f6] transition"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
    </PageWrapper>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: 'How does it work?',
      a: 'NEXUS Alert runs as a Chrome Extension that periodically queries the GOES appointment system for available NEXUS slots. When it detects an opening at your selected enrollment centers, it fires a desktop notification and an audible alert so you can act immediately.',
    },
    {
      q: 'Is it free?',
      a: 'Yes — the core extension is completely free. It checks for slots every 30 minutes and sends desktop and sound notifications. The Premium plan ($4.99/mo) upgrades you to 2-minute checks plus email and SMS alerts even when your browser is closed.',
    },
    {
      q: 'What programs does it support?',
      a: 'NEXUS Alert monitors all Trusted Traveler Programs managed through the GOES system: NEXUS (US-Canada border), Global Entry (US customs fast-track), and SENTRI (US-Mexico border). You can monitor multiple programs and locations simultaneously.',
    },
    {
      q: 'How fast are the notifications?',
      a: 'Free tier checks every 30 minutes. Premium tier checks every 2 minutes. Slots can disappear within seconds of appearing, so upgrading to Premium gives you a significant advantage in catching newly opened appointments.',
    },
    {
      q: 'Is my data private?',
      a: 'Your data stays on your device. The free extension never sends your information to any server — all monitoring happens locally in your browser. Premium users share only their email address for account management and notifications.',
    },
    {
      q: 'How do I cancel Premium?',
      a: 'You can cancel anytime directly from your account settings — no phone calls, no forms. Your Premium features remain active until the end of your current billing period. We also offer a full 30-day money-back guarantee, no questions asked.',
    },
  ];

  return (
    <section id="faq" className="py-20 px-6 border-t border-[#222]">
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
                  className="faq-chevron w-4 h-4 flex-shrink-0 ml-4 text-[#888]"
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

function ChromeLogoSVG() {
  return (
    <svg
      className="w-5 h-5 mr-2 inline"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2C9.14 2 6.6 3.23 4.85 5.2L8.37 11.28C8.84 9.38 10.27 8 12 8h9.46A10 10 0 0 0 12 2z" />
      <path d="M2.17 8.09A10 10 0 0 0 2 10c0 4.08 2.44 7.6 5.98 9.25L11.5 13.2C9.75 12.85 8.4 11.6 8.06 10H2.17z" />
      <path d="M12 22a10 10 0 0 0 8.64-4.97L17.1 10.9A5.97 5.97 0 0 1 18 12c0 3.31-2.69 6-6 6l-3.52 4.04A9.96 9.96 0 0 0 12 22z" />
    </svg>
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
    clock: "M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z",
    refresh:
      "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    calendar:
      "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
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
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-5 rounded-xl border border-[#222] bg-[#111] hover:border-[#3b82f6] transition">
      <h3 className="font-semibold mb-1.5">{title}</h3>
      <p className="text-[#888] text-sm">{description}</p>
    </div>
  );
}

function ProgramBadge({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <div className="px-6 py-4 rounded-xl border border-[#222] bg-[#111] min-w-[180px]">
      <div className="font-bold text-lg">{name}</div>
      <div className="text-[#888] text-sm">{description}</div>
    </div>
  );
}
