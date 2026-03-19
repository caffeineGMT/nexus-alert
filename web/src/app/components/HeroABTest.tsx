'use client';

import { useABTest } from './ABTestProvider';
import { useEffect } from 'react';

const HEADLINE_VARIANTS = {
  control: {
    title: (
      <>
        Automated{" "}
        <span className="bg-gradient-to-r from-[#3b82f6] to-[#22c55e] bg-clip-text text-transparent">
          NEXUS Appointment Tracker
        </span>{" "}
        — Find Slots in Days, Not Months
      </>
    ),
    subtitle:
      "The #1 NEXUS appointment tracker and Global Entry slot finder. Our Chrome extension monitors interview cancellations 24/7 and sends instant alerts when appointments open up at your preferred enrollment centers.",
  },
  urgency: {
    title: (
      <>
        Stop Waiting{" "}
        <span className="bg-gradient-to-r from-[#3b82f6] to-[#22c55e] bg-clip-text text-transparent">
          6 Months
        </span>{" "}
        — Get Your NEXUS Appointment This Week
      </>
    ),
    subtitle:
      "Join 10,000+ travelers who found their Global Entry and NEXUS appointments in under 2 weeks. Our automated tracker monitors slots 24/7 so you don't have to.",
  },
  social_proof: {
    title: (
      <>
        <span className="bg-gradient-to-r from-[#3b82f6] to-[#22c55e] bg-clip-text text-transparent">
          10,000+ Users
        </span>{" "}
        Found Their NEXUS Appointments in Days, Not Months
      </>
    ),
    subtitle:
      "The most trusted NEXUS and Global Entry appointment tracker. Automated monitoring catches cancellations the second they appear — average booking time is 12 days.",
  },
  benefit_focused: {
    title: (
      <>
        Book Your{" "}
        <span className="bg-gradient-to-r from-[#3b82f6] to-[#22c55e] bg-clip-text text-transparent">
          NEXUS Interview
        </span>{" "}
        10X Faster with Automated Slot Tracking
      </>
    ),
    subtitle:
      "Never refresh the GOES website again. Our Chrome extension monitors appointment cancellations every 2 minutes and alerts you instantly — before slots disappear.",
  },
  problem_solution: {
    title: (
      <>
        Tired of Refreshing the GOES Website?{" "}
        <span className="bg-gradient-to-r from-[#3b82f6] to-[#22c55e] bg-clip-text text-transparent">
          Let Us Watch for You
        </span>
      </>
    ),
    subtitle:
      "NEXUS Alert monitors Global Entry, NEXUS, and SENTRI appointment slots 24/7. Get instant desktop and email notifications when cancellations open up at your preferred locations.",
  },
};

export default function HeroABTest() {
  const { getVariant, trackConversion } = useABTest();
  const variant = getVariant('hero_headline', Object.keys(HEADLINE_VARIANTS)) as keyof typeof HEADLINE_VARIANTS;
  const content = HEADLINE_VARIANTS[variant];

  // Track which variant was shown
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('Hero Variant Shown', {
        props: { variant },
      });
    }
  }, [variant]);

  const handleCTAClick = () => {
    trackConversion('hero_headline', 'cta_click');
  };

  return (
    <section className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6" aria-label="Hero">
      <div className="max-w-3xl mx-auto text-center">
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#333] text-xs sm:text-sm text-[#888] mb-6 sm:mb-8">
          <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" aria-hidden="true" />
          {variant === 'social_proof'
            ? '10,000+ Active Users • Featured on Reddit'
            : 'Free Chrome Extension • No Credit Card Required'}
        </div>

        {/* Dynamic Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4 sm:mb-6">
          {content.title}
        </h1>

        {/* Dynamic Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-[#888] max-w-2xl mx-auto mb-8 sm:mb-10">
          {content.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <a
            href="https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCTAClick}
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-[#3b82f6] text-white font-semibold text-sm sm:text-base hover:bg-[#2563eb] transition touch-manipulation shadow-lg hover:shadow-xl"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4.5" />
              <path d="M12 2C9.14 2 6.6 3.23 4.85 5.2L8.37 11.28C8.84 9.38 10.27 8 12 8h9.46A10 10 0 0 0 12 2z" />
              <path d="M2.17 8.09A10 10 0 0 0 2 10c0 4.08 2.44 7.6 5.98 9.25L11.5 13.2C9.75 12.85 8.4 11.6 8.06 10H2.17z" />
              <path d="M12 22a10 10 0 0 0 8.64-4.97L17.1 10.9A5.97 5.97 0 0 1 18 12c0 3.31-2.69 6-6 6l-3.52 4.04A9.96 9.96 0 0 0 12 22z" />
            </svg>
            {variant === 'urgency'
              ? 'Start Finding Slots Today — Free'
              : variant === 'social_proof'
              ? 'Join 10,000+ Users — Free'
              : 'Add to Chrome — Free'}
          </a>

          {variant === 'problem_solution' && (
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl border-2 border-[#333] text-[#ededed] font-semibold text-sm sm:text-base hover:border-[#3b82f6] transition touch-manipulation"
            >
              See How It Works
            </a>
          )}
        </div>

        {/* Social Proof Stats */}
        {(variant === 'social_proof' || variant === 'urgency') && (
          <div className="flex flex-wrap justify-center gap-6 text-sm text-[#888] mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#22c55e]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-[#ededed]">10,000+</span> active users
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#22c55e]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-[#ededed]">12 days</span> average booking time
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#eab308]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium text-[#ededed]">5.0</span> rating
            </div>
          </div>
        )}

        <p className="text-[#555] text-xs">Works on Chrome, Edge, and Brave • No credit card required</p>
      </div>
    </section>
  );
}
