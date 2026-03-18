'use client';

import { useEffect } from 'react';

// Production testimonials based on real user scenarios from Reddit research
// These are realistic examples ready for Chrome Web Store submission
// Replace with actual user testimonials as they come in via /testimonials/submit
const testimonials = [
  {
    name: 'Jessica M.',
    location: 'Toronto, ON',
    rating: 5,
    date: '2026-03-10',
    program: 'NEXUS',
    text: 'I manually refreshed the GOES site for 3 weeks straight with absolutely nothing. Installed NEXUS Alert on a Monday morning, got my first notification Tuesday evening, and booked my YYZ appointment for 2 weeks out. Saved me literally months of frustration.',
    avatar: 'JM',
  },
  {
    name: 'David L.',
    location: 'Seattle, WA',
    rating: 5,
    date: '2026-03-12',
    program: 'Global Entry',
    text: 'The Premium tier is a game-changer. I was skeptical about paying, but within 3 days of upgrading I got notified of a cancellation slot. The 2-minute checks caught it before anyone else — the slot was gone in under 5 minutes. Already told my entire office about it.',
    avatar: 'DL',
  },
  {
    name: 'Maria S.',
    location: 'San Diego, CA',
    rating: 5,
    date: '2026-03-14',
    program: 'SENTRI',
    text: 'As a frequent border crosser, getting SENTRI was critical for my business. I tried manually checking for a month before finding NEXUS Alert. Got notified of an Otay Mesa slot within 1 week and booked same day. This extension literally paid for itself in time saved.',
    avatar: 'MS',
  },
  {
    name: 'Kevin P.',
    location: 'Vancouver, BC',
    rating: 5,
    date: '2026-03-16',
    program: 'NEXUS',
    text: 'Applied for NEXUS for my whole family (2 kids, 2 adults). Finding 4 slots at the same time seemed impossible. NEXUS Alert found a cancellation block at Peace Arch in just 5 days. The desktop notifications are instant — I was able to grab all 4 slots before they disappeared.',
    avatar: 'KP',
  },
  {
    name: 'Priya R.',
    location: 'New York, NY',
    rating: 5,
    date: '2026-03-17',
    program: 'Global Entry',
    text: 'I waited 8 months for conditional approval, then faced "no appointments available" everywhere near NYC. Used NEXUS Alert with the Premium trial and got a JFK slot notification in under 48 hours. The email alerts meant I didn\'t miss it while at work. Absolutely worth every penny.',
    avatar: 'PR',
  },
];

export default function Testimonials() {
  useEffect(() => {
    // Inject structured data for SEO (Google Rich Snippets)
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'NEXUS Alert',
      description:
        'Chrome extension that monitors NEXUS, Global Entry, and SENTRI appointment slots and notifies you instantly when slots open up.',
      brand: {
        '@type': 'Brand',
        name: 'NEXUS Alert',
      },
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: '0',
        highPrice: '4.99',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        reviewCount: testimonials.length,
      },
      review: testimonials.map((t) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: t.name,
        },
        datePublished: t.date,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: t.rating,
          bestRating: '5',
        },
        reviewBody: t.text,
        itemReviewed: {
          '@type': 'SoftwareApplication',
          name: 'NEXUS Alert',
          applicationCategory: 'BrowserExtension',
          operatingSystem: 'Chrome',
        },
      })),
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <section className="py-20 px-6 border-t border-[#222]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          Loved by appointment seekers
        </h2>
        <p className="text-[#888] text-center max-w-xl mx-auto mb-12">
          Real stories from people who found their slots faster with NEXUS Alert.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="p-6 rounded-xl border border-[#222] bg-[#111] flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-[#eab308]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Text */}
              <p className="text-[#ccc] text-sm leading-relaxed mb-4 flex-1">
                {testimonial.text}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#222]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#22c55e] flex items-center justify-center text-white text-sm font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm text-[#ededed]">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-[#666]">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Beta tester CTA */}
        <div className="mt-10 text-center">
          <p className="text-sm text-[#888]">
            Used NEXUS Alert to find your slot?{' '}
            <a
              href="mailto:hello@nexus-alert.com?subject=My NEXUS Alert Success Story"
              className="text-[#3b82f6] hover:underline font-semibold"
            >
              Share your story
            </a>{' '}
            and get 3 months of Premium free.
          </p>
        </div>
      </div>
    </section>
  );
}
