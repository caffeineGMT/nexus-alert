import PricingSection from './components/PricingSection';
import EmailCaptureForm from "./components/EmailCaptureForm";
import ActivityFeed from './components/ActivityFeed';
import UserStats from './components/UserStats';
import Testimonials from './components/Testimonials';
import ExitIntentPopup from './components/ExitIntentPopup';
import TrustBadges from './components/TrustBadges';
import SuccessMetrics from './components/SuccessMetrics';
import ReferralTracker from './components/ReferralTracker';
import { PageWrapper } from './page-wrapper';
import { Suspense } from 'react';

export default function Home() {
  // Schema.org structured data for SEO
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NEXUS Alert',
    url: 'https://nexus-alert.com',
    logo: 'https://nexus-alert.com/logo.png',
    description:
      'Automated NEXUS appointment tracker and Global Entry slot finder. Monitor interview cancellations 24/7 with instant alerts.',
    sameAs: ['https://github.com/caffeineGMT/nexus-alert'],
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'NEXUS Alert',
    applicationCategory: 'BrowserExtension',
    operatingSystem: 'Chrome',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '5',
    },
    description:
      'Free Chrome extension that monitors NEXUS, Global Entry, and SENTRI appointment slots 24/7 and sends instant alerts when cancellations appear.',
  };

  return (
    <PageWrapper>
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
    />
    <Suspense fallback={null}>
      <ReferralTracker />
    </Suspense>
    <ExitIntentPopup />
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span className="text-base sm:text-lg font-bold tracking-tight">NEXUS Alert</span>
          {/* TODO: replace EXTENSION_ID after Chrome Web Store publishing */}
          <a
            href="https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 sm:px-4 py-2 rounded-lg bg-[#3b82f6] text-white text-xs sm:text-sm font-semibold hover:bg-[#2563eb] transition touch-manipulation"
          >
            Install Free
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#333] text-xs sm:text-sm text-[#888] mb-6 sm:mb-8">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            Free Chrome Extension
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4 sm:mb-6">
            Automated{" "}
            <span className="bg-gradient-to-r from-[#3b82f6] to-[#22c55e] bg-clip-text text-transparent">
              NEXUS Appointment Tracker
            </span>{" "}
            — Find Slots in Days, Not Months
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[#888] max-w-2xl mx-auto mb-8 sm:mb-10">
            The #1 NEXUS appointment tracker and Global Entry slot finder. Our Chrome extension monitors interview cancellations 24/7 and sends instant alerts when appointments open up at your preferred enrollment centers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* TODO: replace EXTENSION_ID after Chrome Web Store publishing */}
            <a
              href="https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-[#3b82f6] text-white font-semibold text-sm sm:text-base hover:bg-[#2563eb] transition touch-manipulation"
            >
              <ChromeLogoSVG />
              Add to Chrome — Free
            </a>
          </div>
          <p className="text-[#555] text-xs mt-2">Works on Chrome, Edge, and Brave</p>
          <EmailCaptureForm />
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Success Metrics */}
      <SuccessMetrics />

      {/* Social Proof - Activity Feed */}
      <section className="py-16 px-6 border-t border-[#222] bg-gradient-to-b from-[#0a0a0a] to-[#111]">
        <ActivityFeed />
        <UserStats />
      </section>

      {/* Problem */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 border-t border-[#222]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Appointment slots disappear in minutes
          </h2>
          <p className="text-sm sm:text-base text-[#888] text-center max-w-2xl mx-auto mb-12 sm:mb-14">
            NEXUS and Global Entry slots are released when someone cancels.
            They show up randomly and get booked almost instantly. Refreshing
            the website over and over is exhausting — and you still miss most
            of them.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
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
      <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-6 border-t border-[#222]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 sm:mb-14">
            How NEXUS Alert works
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <StepCard
              step={1}
              title="Pick your locations"
              description="Select which enrollment centers you want to monitor. Choose NEXUS, Global Entry, or SENTRI."
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
      <section className="py-16 sm:py-20 px-4 sm:px-6 border-t border-[#222]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Everything you need
          </h2>
          <p className="text-sm sm:text-base text-[#888] text-center max-w-xl mx-auto mb-12 sm:mb-14">
            Built to make sure you never miss another opening.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
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

      {/* Comparison Table */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 border-t border-[#222] bg-gradient-to-b from-[#0a0a0a] to-[#111]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Why NEXUS Alert beats manual checking
          </h2>
          <p className="text-sm sm:text-base text-[#888] text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            See how our automated NEXUS appointment tracker compares to manual checking and other solutions
          </p>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full px-4 sm:px-0">
            <table className="w-full border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b-2 border-[#3b82f6]">
                  <th className="text-left py-3 sm:py-4 px-2 sm:px-4 font-semibold text-sm sm:text-base text-[#ededed]">Feature</th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 font-semibold text-xs sm:text-base text-[#3b82f6]">NEXUS Alert Free</th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 font-semibold text-xs sm:text-base text-[#22c55e]">NEXUS Alert Premium</th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 font-semibold text-xs sm:text-base text-[#888]">Manual Checking</th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 font-semibold text-xs sm:text-base text-[#888]">Other Tools</th>
                </tr>
              </thead>
              <tbody>
                <ComparisonRow
                  feature="Check Frequency"
                  nexusFree="Every 30 min"
                  nexusPremium="Every 2 min"
                  manual="When you remember"
                  other="Every 5-15 min"
                />
                <ComparisonRow
                  feature="24/7 Monitoring"
                  nexusFree={true}
                  nexusPremium={true}
                  manual={false}
                  other={true}
                />
                <ComparisonRow
                  feature="Desktop Notifications"
                  nexusFree={true}
                  nexusPremium={true}
                  manual={false}
                  other="Limited"
                />
                <ComparisonRow
                  feature="Sound Alerts"
                  nexusFree={true}
                  nexusPremium={true}
                  manual={false}
                  other={false}
                />
                <ComparisonRow
                  feature="Email Alerts"
                  nexusFree={false}
                  nexusPremium={true}
                  manual={false}
                  other="Paid only"
                />
                <ComparisonRow
                  feature="SMS Alerts"
                  nexusFree={false}
                  nexusPremium={true}
                  manual={false}
                  other={false}
                />
                <ComparisonRow
                  feature="Multi-Location Tracking"
                  nexusFree={true}
                  nexusPremium={true}
                  manual="Manual only"
                  other={true}
                />
                <ComparisonRow
                  feature="Smart Date Filters"
                  nexusFree={true}
                  nexusPremium={true}
                  manual={false}
                  other="Limited"
                />
                <ComparisonRow
                  feature="One-Click Booking"
                  nexusFree={true}
                  nexusPremium={true}
                  manual={false}
                  other={true}
                />
                <ComparisonRow
                  feature="Slot History"
                  nexusFree={true}
                  nexusPremium={true}
                  manual={false}
                  other={false}
                />
                <ComparisonRow
                  feature="Average Time to Book"
                  nexusFree="2-4 weeks"
                  nexusPremium="1-2 weeks"
                  manual="3-6 months"
                  other="2-5 weeks"
                />
                <ComparisonRow
                  feature="Cost"
                  nexusFree="$0"
                  nexusPremium="$4.99/mo"
                  manual="$0 (but your time)"
                  other="$10-20/mo"
                  isLast={true}
                />
              </tbody>
            </table>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 text-center">
            <a
              href="https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-[#3b82f6] text-white font-semibold text-sm sm:text-base hover:bg-[#2563eb] transition touch-manipulation"
            >
              Try NEXUS Alert Free
            </a>
          </div>
        </div>
      </section>

      <PricingSection />

      {/* Community Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 border-t border-[#222] bg-gradient-to-b from-[#0a0a0a] to-[#0f0f14]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Join the NEXUS Alert Insiders Community
            </h2>
            <p className="text-sm sm:text-base text-[#888] max-w-xl mx-auto">
              Premium members get access to our exclusive Discord community — share tips, celebrate wins, and get early access to new features.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12">
            <CommunityFeature
              icon="🚀"
              title="First Access to Features"
              description="Beta test new features before anyone else and shape the product roadmap with direct feedback to the founder."
            />
            <CommunityFeature
              icon="💡"
              title="Appointment Tips & Tricks"
              description="Learn from fellow travelers who've successfully booked NEXUS, Global Entry, and SENTRI appointments."
            />
            <CommunityFeature
              icon="🎯"
              title="Direct Founder Support"
              description="Get help directly from the creator. Technical issues, feature requests, or just questions — we're here."
            />
            <CommunityFeature
              icon="🎉"
              title="Celebrate Wins Together"
              description="Share your appointment booking success stories and screenshots. Nothing beats the community energy when someone books their interview!"
            />
          </div>

          <div className="bg-gradient-to-r from-[#5865F2]/10 to-[#5865F2]/5 border border-[#5865F2]/30 rounded-2xl p-6 sm:p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <svg className="w-8 sm:w-10 h-8 sm:h-10" fill="#5865F2" viewBox="0 0 71 55">
                <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"/>
              </svg>
              <span className="text-xl sm:text-2xl font-bold">200+ Active Members</span>
            </div>
            <p className="text-sm sm:text-base text-[#888] mb-6">
              Join travelers from across North America sharing tips, wins, and support
            </p>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#eab308]/10 to-[#f59e0b]/10 border border-[#eab308]/30 rounded-full px-4 py-2 mb-6">
              <span className="text-lg">🏆</span>
              <span className="text-sm font-semibold text-[#eab308]">
                First 100 members get lifetime 20% discount
              </span>
            </div>
            <div>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-[#5865F2] text-white font-semibold text-base hover:bg-[#4752C4] transition"
              >
                Upgrade to Premium → Join Community
              </a>
            </div>
          </div>
        </div>
      </section>

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
            Install NEXUS Alert and let it watch for openings while you live
            your life. Completely free, no account needed.
          </p>
          {/* TODO: replace EXTENSION_ID after Chrome Web Store publishing */}
          <a
            href="https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#3b82f6] text-white font-semibold text-lg hover:bg-[#2563eb] transition"
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
            href="/how-it-works"
            className="text-[#888] hover:text-[#3b82f6] transition"
          >
            How It Works
          </a>
          <a
            href="/blog"
            className="text-[#888] hover:text-[#3b82f6] transition"
          >
            Blog
          </a>
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
    </>
    </PageWrapper>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: 'How does the NEXUS appointment tracker work?',
      a: 'NEXUS Alert runs as a Chrome Extension that periodically queries the GOES appointment system for available slots. When it detects an opening at your selected enrollment centers, it fires a desktop notification and an audible alert so you can act immediately.',
    },
    {
      q: 'Is this NEXUS slot finder free?',
      a: 'Yes — the core extension is completely free. It checks for slots every 30 minutes and sends desktop and sound notifications. The Premium plan ($4.99/mo) upgrades you to 2-minute checks plus email and SMS alerts even when your browser is closed.',
    },
    {
      q: 'What programs does it support?',
      a: 'NEXUS Alert monitors all Trusted Traveler Programs managed through the GOES system: NEXUS (US-Canada border), Global Entry (US customs fast-track), and SENTRI (US-Mexico border). You can monitor multiple programs and locations simultaneously.',
    },
    {
      q: 'How fast are the appointment cancellation alerts?',
      a: 'Free tier checks every 30 minutes. Premium tier checks every 2 minutes. Slots can disappear within seconds of appearing, so upgrading to Premium gives you a significant advantage in catching newly opened appointments.',
    },
    {
      q: 'Is my data private?',
      a: 'Your data stays on your device. The free extension never sends your information to any server — all monitoring happens locally in your browser. Premium users share only their email address for account management and notifications.',
    },
    {
      q: 'Can I track multiple NEXUS interview locations?',
      a: 'Yes! NEXUS Alert lets you monitor multiple enrollment centers simultaneously. This dramatically increases your chances of finding an appointment sooner, especially if you\'re willing to travel to nearby locations.',
    },
    {
      q: 'How do I cancel Premium?',
      a: 'You can cancel anytime directly from your account settings — no phone calls, no forms. Your Premium features remain active until the end of your current billing period. We also offer a full 30-day money-back guarantee, no questions asked.',
    },
    {
      q: 'How long does it take to find an appointment?',
      a: 'Most users find appointments within 2-4 weeks using NEXUS Alert, compared to 3-6 months of manual checking. Some users have booked same-week slots at popular locations by using Premium\'s 2-minute check frequency.',
    },
  ];

  // FAQ Schema for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
    </>
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

function CommunityFeature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl border border-[#222] bg-[#111] hover:border-[#5865F2]/50 transition">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-[#888] text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function ComparisonRow({
  feature,
  nexusFree,
  nexusPremium,
  manual,
  other,
  isLast = false,
}: {
  feature: string;
  nexusFree: boolean | string;
  nexusPremium: boolean | string;
  manual: boolean | string;
  other: boolean | string;
  isLast?: boolean;
}) {
  const renderCell = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <svg className="w-5 h-5 text-[#22c55e] mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-[#555] mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      );
    }
    return <span className="text-sm text-[#ccc]">{value}</span>;
  };

  return (
    <tr className={`${!isLast ? 'border-b border-[#222]' : ''} hover:bg-[#111]/50 transition`}>
      <td className="py-4 px-4 text-[#ededed] font-medium">{feature}</td>
      <td className="py-4 px-4 text-center">{renderCell(nexusFree)}</td>
      <td className="py-4 px-4 text-center">{renderCell(nexusPremium)}</td>
      <td className="py-4 px-4 text-center">{renderCell(manual)}</td>
      <td className="py-4 px-4 text-center">{renderCell(other)}</td>
    </tr>
  );
}
