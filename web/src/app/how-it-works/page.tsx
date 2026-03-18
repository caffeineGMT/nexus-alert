import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How It Works - NEXUS Alert Appointment Tracker | Step-by-Step Guide',
  description:
    'Learn how NEXUS Alert monitors NEXUS, Global Entry, and SENTRI appointment slots 24/7. Step-by-step guide to finding interview slots faster with automated tracking.',
  keywords: [
    'how NEXUS alert works',
    'NEXUS appointment tracker guide',
    'automated appointment monitoring',
    'NEXUS slot finder tutorial',
  ],
  openGraph: {
    title: 'How NEXUS Alert Works - Step-by-Step Guide',
    description:
      'Learn how our automated appointment tracker finds NEXUS, Global Entry, and SENTRI slots 24/7.',
    url: 'https://nexus-alert.com/how-it-works',
    siteName: 'NEXUS Alert',
    type: 'website',
  },
  alternates: {
    canonical: 'https://nexus-alert.com/how-it-works',
  },
};

export default function HowItWorks() {
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Find NEXUS Appointments Fast with NEXUS Alert',
    description:
      'Step-by-step guide to using NEXUS Alert to monitor NEXUS, Global Entry, and SENTRI appointment slots automatically.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Install the Chrome Extension',
        text: 'Add NEXUS Alert to your Chrome browser. The extension is completely free and takes 10 seconds to install.',
        url: 'https://nexus-alert.com/how-it-works#step-1',
      },
      {
        '@type': 'HowToStep',
        name: 'Select Your Enrollment Centers',
        text: 'Choose which NEXUS, Global Entry, or SENTRI enrollment centers you want to monitor. You can track multiple locations simultaneously.',
        url: 'https://nexus-alert.com/how-it-works#step-2',
      },
      {
        '@type': 'HowToStep',
        name: 'Set Your Preferences',
        text: 'Filter by date range and time of day. Choose how often to check — every 1, 3, 5, or 10 minutes depending on your plan.',
        url: 'https://nexus-alert.com/how-it-works#step-3',
      },
      {
        '@type': 'HowToStep',
        name: 'Get Instant Alerts',
        text: 'When a slot opens, you receive a desktop notification with a sound alert. One click takes you straight to the GOES booking page.',
        url: 'https://nexus-alert.com/how-it-works#step-4',
      },
      {
        '@type': 'HowToStep',
        name: 'Book Your Appointment',
        text: 'Act fast — slots disappear in minutes. Use the one-click link to jump directly to the booking page and secure your interview time.',
        url: 'https://nexus-alert.com/how-it-works#step-5',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
        {/* Nav */}
        <nav className="fixed top-0 w-full z-50 border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold tracking-tight">
              NEXUS Alert
            </Link>
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
        <section className="pt-32 pb-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              How NEXUS Alert Works
            </h1>
            <p className="text-xl text-[#888] max-w-2xl mx-auto">
              Automated 24/7 monitoring that finds NEXUS, Global Entry, and SENTRI appointment slots
              so you don't have to. Here's how it works.
            </p>
          </div>
        </section>

        {/* Visual Step-by-Step Guide */}
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            {/* Step 1 */}
            <div id="step-1" className="mb-20">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#3b82f6] text-white flex items-center justify-center text-xl font-bold">
                      1
                    </div>
                    <h2 className="text-3xl font-bold">Install the Extension</h2>
                  </div>
                  <p className="text-lg text-[#888] mb-6 leading-relaxed">
                    Add NEXUS Alert to your Chrome browser in 10 seconds. The extension is completely
                    free and works on Chrome, Edge, and Brave browsers. No account required to get
                    started.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <FeatureItem text="100% free to install" />
                    <FeatureItem text="No credit card needed" />
                    <FeatureItem text="Works on all Chromium browsers" />
                    <FeatureItem text="Privacy-first: data stays on your device" />
                  </ul>
                  <a
                    href="https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#3b82f6] text-white font-semibold hover:bg-[#2563eb] transition"
                  >
                    Install Free Extension
                  </a>
                </div>
                <div className="flex-1">
                  <div className="p-8 rounded-xl border-2 border-[#3b82f6] bg-gradient-to-br from-[#0f1729] to-[#0a0a0a]">
                    <div className="text-6xl mb-4 text-center">🔧</div>
                    <p className="text-center text-[#888] text-sm">
                      One-click installation from Chrome Web Store
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div id="step-2" className="mb-20">
              <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#3b82f6] text-white flex items-center justify-center text-xl font-bold">
                      2
                    </div>
                    <h2 className="text-3xl font-bold">Select Your Locations</h2>
                  </div>
                  <p className="text-lg text-[#888] mb-6 leading-relaxed">
                    Choose which enrollment centers you want to monitor. Pick NEXUS, Global Entry, or
                    SENTRI locations. Track multiple centers simultaneously to increase your chances.
                  </p>
                  <ul className="space-y-3">
                    <FeatureItem text="Monitor multiple locations at once" />
                    <FeatureItem text="All 13 NEXUS locations supported" />
                    <FeatureItem text="All 100+ Global Entry centers available" />
                    <FeatureItem text="SENTRI locations along US-Mexico border" />
                  </ul>
                </div>
                <div className="flex-1">
                  <div className="p-8 rounded-xl border-2 border-[#22c55e] bg-gradient-to-br from-[#0f1729] to-[#0a0a0a]">
                    <div className="text-6xl mb-4 text-center">🗺️</div>
                    <p className="text-center text-[#888] text-sm">
                      Select from all available enrollment centers
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div id="step-3" className="mb-20">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#3b82f6] text-white flex items-center justify-center text-xl font-bold">
                      3
                    </div>
                    <h2 className="text-3xl font-bold">Set Your Preferences</h2>
                  </div>
                  <p className="text-lg text-[#888] mb-6 leading-relaxed">
                    Filter by date range and time of day. Only get notified for appointments that
                    actually work for your schedule. Choose your check frequency based on your plan.
                  </p>
                  <div className="space-y-4 mb-6">
                    <div className="p-4 rounded-lg border border-[#222] bg-[#111]">
                      <div className="font-semibold mb-2">Free Plan</div>
                      <p className="text-sm text-[#888]">Checks every 30 minutes with desktop notifications</p>
                    </div>
                    <div className="p-4 rounded-lg border border-[#22c55e] bg-[#0f1729]">
                      <div className="font-semibold mb-2 text-[#22c55e]">Premium Plan</div>
                      <p className="text-sm text-[#888]">Checks every 2 minutes with email + SMS alerts</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    <FeatureItem text="Smart date filters" />
                    <FeatureItem text="Time-of-day preferences" />
                    <FeatureItem text="Customizable check frequency" />
                  </ul>
                </div>
                <div className="flex-1">
                  <div className="p-8 rounded-xl border-2 border-[#f59e0b] bg-gradient-to-br from-[#0f1729] to-[#0a0a0a]">
                    <div className="text-6xl mb-4 text-center">⚙️</div>
                    <p className="text-center text-[#888] text-sm">
                      Customize filters to match your schedule
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div id="step-4" className="mb-20">
              <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#3b82f6] text-white flex items-center justify-center text-xl font-bold">
                      4
                    </div>
                    <h2 className="text-3xl font-bold">Get Instant Alerts</h2>
                  </div>
                  <p className="text-lg text-[#888] mb-6 leading-relaxed">
                    When a slot opens at one of your selected locations, NEXUS Alert immediately sends
                    you a notification. Desktop pop-ups with sound alerts ensure you never miss an
                    opportunity.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <FeatureItem text="Desktop notifications with sound" />
                    <FeatureItem text="Email alerts (Premium)" />
                    <FeatureItem text="SMS text alerts (Premium)" />
                    <FeatureItem text="Shows appointment date, time, and location" />
                  </ul>
                  <div className="p-4 rounded-lg border border-[#3b82f6] bg-[#0f1729]">
                    <p className="text-sm text-[#888]">
                      <strong className="text-[#ededed]">Pro Tip:</strong> Enable sound alerts so you can
                      hear notifications even when working on other tasks. Slots disappear in minutes!
                    </p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="p-8 rounded-xl border-2 border-[#ef4444] bg-gradient-to-br from-[#0f1729] to-[#0a0a0a]">
                    <div className="text-6xl mb-4 text-center">🔔</div>
                    <p className="text-center text-[#888] text-sm">
                      Instant notifications when slots appear
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div id="step-5" className="mb-12">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#3b82f6] text-white flex items-center justify-center text-xl font-bold">
                      5
                    </div>
                    <h2 className="text-3xl font-bold">Book Your Appointment</h2>
                  </div>
                  <p className="text-lg text-[#888] mb-6 leading-relaxed">
                    Act fast! Click the notification to jump directly to the GOES booking page with the
                    slot pre-selected. Appointment slots can disappear in seconds, so speed matters.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <FeatureItem text="One-click booking links" />
                    <FeatureItem text="Auto-open booking page (optional)" />
                    <FeatureItem text="Slot history tracking" />
                    <FeatureItem text="Continue monitoring after booking" />
                  </ul>
                  <div className="p-4 rounded-lg border border-[#22c55e] bg-[#0f1729]">
                    <p className="text-sm text-[#888]">
                      <strong className="text-[#ededed]">Success Rate:</strong> Most users book
                      appointments within 2-4 weeks instead of 3-6 months of manual checking.
                    </p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="p-8 rounded-xl border-2 border-[#22c55e] bg-gradient-to-br from-[#0f1729] to-[#0a0a0a]">
                    <div className="text-6xl mb-4 text-center">✅</div>
                    <p className="text-center text-[#888] text-sm">
                      Secure your appointment in seconds
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Monitors */}
        <section className="py-20 px-6 border-t border-[#222] bg-gradient-to-b from-[#0a0a0a] to-[#111]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">
              How the Monitoring Works
            </h2>
            <p className="text-[#888] text-center max-w-2xl mx-auto mb-12">
              Behind the scenes: Understanding the technology that finds your appointments
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-xl border border-[#222] bg-[#111]">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-bold mb-3">Automated Checking</h3>
                <p className="text-[#888] text-sm leading-relaxed">
                  NEXUS Alert queries the official GOES appointment API at your chosen frequency. The
                  extension runs silently in the background, checking continuously without any manual
                  effort from you.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-[#222] bg-[#111]">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-3">Smart Filtering</h3>
                <p className="text-[#888] text-sm leading-relaxed">
                  Your date and time preferences are applied server-side. You only get notified about
                  slots that match your criteria — no spam, no irrelevant alerts.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-[#222] bg-[#111]">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-3">Real-Time Detection</h3>
                <p className="text-[#888] text-sm leading-relaxed">
                  The moment a cancellation appears in the system, NEXUS Alert detects it and triggers
                  your notification. Premium users with 2-minute checks often catch slots before anyone
                  else.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-[#222] bg-[#111]">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-bold mb-3">Privacy First</h3>
                <p className="text-[#888] text-sm leading-relaxed">
                  Free tier: All monitoring happens locally in your browser. Zero data sent to servers.
                  Premium tier: Only your email/phone and selected preferences are stored for
                  notifications.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-6 border-t border-[#222]">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Common Questions
            </h2>
            <div className="space-y-6">
              <QuestionAnswer
                question="Do I need to keep my browser open?"
                answer="For the free tier, yes — the extension monitors while your browser is running. Premium tier sends email/SMS alerts even when your browser is closed, providing 24/7 coverage."
              />
              <QuestionAnswer
                question="How quickly do I need to act after getting an alert?"
                answer="Fast! Popular slots (like Blaine or Niagara Falls) can disappear in under 5 minutes. Premium users with 2-minute checks have the best odds of securing competitive slots."
              />
              <QuestionAnswer
                question="Can I track multiple programs simultaneously?"
                answer="Absolutely. You can monitor NEXUS, Global Entry, and SENTRI locations all at once. Many users track 3-5 enrollment centers to maximize their chances."
              />
              <QuestionAnswer
                question="What happens after I book an appointment?"
                answer="Keep monitoring! You can continue running NEXUS Alert to find earlier slots and reschedule. Many users move their appointments up by weeks using this strategy."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 border-t border-[#222]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Find Your Appointment?
            </h2>
            <p className="text-[#888] text-lg mb-10">
              Install NEXUS Alert and start monitoring appointment slots in under 60 seconds.
              Completely free, no credit card required.
            </p>
            <a
              href="https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#3b82f6] text-white font-semibold text-lg hover:bg-[#2563eb] transition"
            >
              Install Free Chrome Extension
            </a>
            <p className="text-[#555] text-sm mt-4">
              Works on Chrome, Edge, and Brave • No account needed
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-[#222] text-center text-sm text-[#555]">
          <p>
            NEXUS Alert is free and open source. Not affiliated with CBP or DHS.
          </p>
          <div className="mt-3 space-x-4">
            <Link href="/" className="text-[#888] hover:text-[#3b82f6] transition">
              Home
            </Link>
            <Link href="/privacy" className="text-[#888] hover:text-[#3b82f6] transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[#888] hover:text-[#3b82f6] transition">
              Terms of Service
            </Link>
            <a
              href="https://github.com/caffeineGMT/nexus-alert"
              className="text-[#888] hover:text-[#3b82f6] transition"
            >
              GitHub
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <svg className="w-5 h-5 text-[#22c55e] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-[#ccc]">{text}</span>
    </li>
  );
}

function QuestionAnswer({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="p-6 rounded-xl border border-[#222] bg-[#111]">
      <h3 className="font-semibold text-lg mb-2">{question}</h3>
      <p className="text-[#888] text-sm leading-relaxed">{answer}</p>
    </div>
  );
}
