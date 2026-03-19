'use client';

import { useEffect, useState } from 'react';
import { getChromeStoreUrl, shouldOpenInNewTab } from '@/lib/chrome-store';

/**
 * A/B Test: Hero Headline Variants
 *
 * Control: "Never miss a NEXUS, Global Entry, or SENTRI appointment again"
 * Variant A: Specific time savings
 * Variant B: Outcome focused
 * Variant C: Social proof lead
 */

export type HeroVariant = 'control' | 'variantA' | 'variantB' | 'variantC';

interface HeroContent {
  headline: React.ReactNode;
  subheadline: string;
  ctaText: string;
}

const variants: Record<HeroVariant, HeroContent> = {
  control: {
    headline: (
      <>
        Never miss a{" "}
        <span className="bg-gradient-to-r from-[#3b82f6] to-[#22c55e] bg-clip-text text-transparent">
          NEXUS, Global Entry, or SENTRI appointment
        </span>{" "}
        again
      </>
    ),
    subheadline:
      "NEXUS Alert watches for appointment openings 24/7 and notifies you the instant a slot appears — so you can book it before anyone else.",
    ctaText: "Add to Chrome — Free",
  },
  variantA: {
    headline: (
      <>
        Book your NEXUS appointment in{" "}
        <span className="bg-gradient-to-r from-[#3b82f6] to-[#22c55e] bg-clip-text text-transparent">
          3 days instead of 3 months
        </span>
      </>
    ),
    subheadline:
      "Stop manually refreshing the GOES website. NEXUS Alert automatically monitors appointment slots and alerts you within seconds when cancellations appear.",
    ctaText: "Start Monitoring Free",
  },
  variantB: {
    headline: (
      <>
        Get the{" "}
        <span className="bg-gradient-to-r from-[#3b82f6] to-[#22c55e] bg-clip-text text-transparent">
          earliest NEXUS appointment
        </span>{" "}
        — automatically
      </>
    ),
    subheadline:
      "NEXUS Alert checks for cancellations every minute and sends instant desktop notifications. Book your interview weeks or months earlier than waiting for the next available slot.",
    ctaText: "Find My Appointment",
  },
  variantC: {
    headline: (
      <>
        Join{" "}
        <span className="bg-gradient-to-r from-[#3b82f6] to-[#22c55e] bg-clip-text text-transparent">
          847 travelers
        </span>{" "}
        who booked NEXUS appointments this month
      </>
    ),
    subheadline:
      "Real people using NEXUS Alert are finding appointment slots in an average of 3.2 days. No more endless refreshing. Just install, set your preferences, and get notified.",
    ctaText: "Join Them — Free",
  },
};

export function useHeroVariant(): HeroVariant {
  const [variant, setVariant] = useState<HeroVariant>('control');

  useEffect(() => {
    // Check if user already has a variant assigned
    const stored = localStorage.getItem('nexus_hero_variant');
    if (stored && stored in variants) {
      setVariant(stored as HeroVariant);
      return;
    }

    // Assign random variant (25% each)
    const random = Math.random();
    let assigned: HeroVariant;
    if (random < 0.25) assigned = 'control';
    else if (random < 0.5) assigned = 'variantA';
    else if (random < 0.75) assigned = 'variantB';
    else assigned = 'variantC';

    localStorage.setItem('nexus_hero_variant', assigned);
    setVariant(assigned);

    // Track variant assignment
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ab_test_assigned', {
        test_name: 'hero_headline',
        variant: assigned,
      });
    }

    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('AB Test Assigned', {
        props: {
          test: 'hero_headline',
          variant: assigned,
        },
      });
    }
  }, []);

  return variant;
}

export function getHeroContent(variant: HeroVariant): HeroContent {
  return variants[variant];
}

interface HeroSectionProps {
  variant?: HeroVariant;
  onCtaClick?: () => void;
}

export default function HeroSection({ variant: propVariant, onCtaClick }: HeroSectionProps) {
  const autoVariant = useHeroVariant();
  const variant = propVariant || autoVariant;
  const content = getHeroContent(variant);

  const handleCtaClick = () => {
    // Track CTA click with variant info
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'hero_cta_click', {
        variant: variant,
        cta_text: content.ctaText,
      });
    }

    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('Hero CTA Click', {
        props: {
          variant: variant,
          cta_text: content.ctaText,
        },
      });
    }

    if (onCtaClick) {
      onCtaClick();
    }
  };

  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#333] text-sm text-[#888] mb-8">
          <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
          Free Chrome Extension
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
          {content.headline}
        </h1>
        <p className="text-lg md:text-xl text-[#888] max-w-2xl mx-auto mb-10">
          {content.subheadline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={getChromeStoreUrl({ source: 'hero_variant', medium: 'hero', campaign: 'install', content: variant })}
            target={shouldOpenInNewTab() ? "_blank" : undefined}
            rel={shouldOpenInNewTab() ? "noopener noreferrer" : undefined}
            onClick={handleCtaClick}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#3b82f6] text-white font-semibold text-base hover:bg-[#2563eb] transition"
          >
            <ChromeLogoSVG />
            {content.ctaText}
          </a>
        </div>
        <p className="text-[#555] text-xs mt-2">Works on Chrome, Edge, and Brave</p>
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
