export const metadata = {
  title: 'Install NEXUS Alert - Chrome Extension Installation Guide',
  description: 'Step-by-step guide to install the NEXUS Alert Chrome extension for automated appointment tracking.',
};

export default function InstallGuidePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="text-base sm:text-lg font-bold tracking-tight hover:text-[#3b82f6] transition">
            NEXUS Alert
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#eab308] bg-[#eab308]/10 text-sm text-[#eab308] mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Chrome Web Store Submission Pending
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight mb-6">
            NEXUS Alert Installation Guide
          </h1>

          <div className="bg-gradient-to-r from-[#3b82f6]/10 to-[#8b5cf6]/10 border border-[#3b82f6]/30 rounded-2xl p-6 sm:p-8 mb-10">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <svg className="w-6 h-6 text-[#3b82f6]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Extension Under Review
            </h2>
            <p className="text-[#ccc] mb-4">
              NEXUS Alert has been submitted to the Chrome Web Store and is currently under review by Google.
              This process typically takes 3-5 business days.
            </p>
            <p className="text-sm text-[#888]">
              We'll update this page with installation instructions as soon as the extension is approved.
              Check back soon or sign up below to be notified when it's ready.
            </p>
          </div>

          {/* What to Expect */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">What happens after approval?</h2>
            <div className="space-y-4">
              <StepItem
                number={1}
                title="Extension Goes Live"
                description="Once approved, NEXUS Alert will be available on the Chrome Web Store for immediate installation."
              />
              <StepItem
                number={2}
                title="One-Click Installation"
                description="You'll be able to install the extension with a single click directly from the Chrome Web Store."
              />
              <StepItem
                number={3}
                title="Start Tracking Immediately"
                description="After installation, you can immediately start monitoring NEXUS, Global Entry, and SENTRI appointment slots."
              />
            </div>
          </section>

          {/* Alternative: Join Waitlist */}
          <section className="bg-[#111] border border-[#222] rounded-2xl p-6 sm:p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">Get Notified When It's Ready</h2>
            <p className="text-[#888] mb-6">
              Enter your email below and we'll send you a notification the moment NEXUS Alert is approved
              and ready to install.
            </p>

            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-lg bg-[#0a0a0a] border border-[#333] text-[#ededed] placeholder-[#555] focus:border-[#3b82f6] focus:outline-none"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-[#3b82f6] text-white font-semibold hover:bg-[#2563eb] transition whitespace-nowrap"
              >
                Notify Me
              </button>
            </form>

            <p className="text-xs text-[#555] mt-3">
              We'll only email you when the extension is live. No spam, unsubscribe anytime.
            </p>
          </section>

          {/* Features Preview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">What You'll Get</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <FeatureCard
                icon="🔔"
                title="Instant Alerts"
                description="Desktop and sound notifications when appointment slots appear"
              />
              <FeatureCard
                icon="⚡"
                title="Real-Time Monitoring"
                description="Check for slots every 1-30 minutes, running in the background"
              />
              <FeatureCard
                icon="🎯"
                title="Smart Filters"
                description="Only get notified for dates, times, and locations you prefer"
              />
              <FeatureCard
                icon="🌍"
                title="Multi-Location"
                description="Track multiple enrollment centers simultaneously"
              />
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="border-b border-[#222] group">
                <summary className="py-4 flex justify-between items-center cursor-pointer list-none font-medium select-none">
                  When will the extension be available?
                  <svg className="w-4 h-4 text-[#888]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="pb-4 text-[#888] text-sm leading-relaxed">
                  Chrome Web Store reviews typically take 3-5 business days. We submitted on March 18, 2026,
                  so we expect approval by March 25, 2026. We'll update this page immediately when it's live.
                </p>
              </details>

              <details className="border-b border-[#222] group">
                <summary className="py-4 flex justify-between items-center cursor-pointer list-none font-medium select-none">
                  Is it really free?
                  <svg className="w-4 h-4 text-[#888]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="pb-4 text-[#888] text-sm leading-relaxed">
                  Yes! The core extension is completely free with no credit card required. It checks for slots
                  every 30 minutes and sends desktop notifications. We also offer a Premium tier ($4.99/month)
                  for 2-minute checks and email/SMS alerts.
                </p>
              </details>

              <details className="border-b border-[#222] group">
                <summary className="py-4 flex justify-between items-center cursor-pointer list-none font-medium select-none">
                  How will I know when it's approved?
                  <svg className="w-4 h-4 text-[#888]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="pb-4 text-[#888] text-sm leading-relaxed">
                  If you sign up for notifications above, we'll email you the moment it's live. You can also
                  check back on this page or follow us on social media for updates.
                </p>
              </details>
            </div>
          </section>

          {/* CTA */}
          <div className="mt-12 text-center">
            <a
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-[#333] text-[#ededed] font-semibold hover:border-[#3b82f6] hover:text-[#3b82f6] transition"
            >
              ← Back to Homepage
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#222] text-center text-sm text-[#555]">
        <p>NEXUS Alert is free and open source. Not affiliated with CBP or DHS.</p>
      </footer>
    </div>
  );
}

function StepItem({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#3b82f6] text-white flex items-center justify-center text-sm font-bold">
        {number}
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-[#888]">{description}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-4 rounded-xl border border-[#222] bg-[#111]">
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-[#888]">{description}</p>
    </div>
  );
}
