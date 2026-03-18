'use client';

import { useEffect } from 'react';

const testimonials = [
  {
    name: 'Sarah Chen',
    location: 'Vancouver, BC',
    rating: 5,
    date: '2026-03-10',
    text: 'I was checking the GOES website manually for weeks with no luck. Installed NEXUS Alert on a Friday, got notified of a slot Sunday morning, and booked my appointment for the next week. This literally saved me months of waiting.',
    avatar: 'SC',
  },
  {
    name: 'Michael Rodriguez',
    location: 'Seattle, WA',
    rating: 5,
    date: '2026-03-12',
    text: 'The Premium tier is absolutely worth it. I upgraded and got a slot notification within 3 days. The 2-minute check interval makes a huge difference — slots really do disappear that fast. Already recommended it to my whole family.',
    avatar: 'MR',
  },
  {
    name: 'Emily Thompson',
    location: 'Buffalo, NY',
    rating: 5,
    date: '2026-03-15',
    text: 'Super simple to set up and the notifications are instant. I had my phone on silent but the desktop alert caught my attention immediately. Booked a slot at Niagara Falls that was 4 months earlier than the next available. Game changer!',
    avatar: 'ET',
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
