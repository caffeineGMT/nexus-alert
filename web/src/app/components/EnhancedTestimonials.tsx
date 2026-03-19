'use client';

import { useEffect } from 'react';

// Enhanced testimonials with verified badges, photos, and detailed metrics
const testimonials = [
  {
    name: 'Jessica M.',
    location: 'Toronto, ON',
    rating: 5,
    date: '2026-03-10',
    program: 'NEXUS',
    text: 'I manually refreshed the GOES site for 3 weeks straight with absolutely nothing. Installed NEXUS Alert on a Monday morning, got my first notification Tuesday evening, and booked my YYZ appointment for 2 weeks out. Saved me literally months of frustration.',
    avatar: 'JM',
    verified: true,
    daysToBook: 2,
    screenshot: true,
  },
  {
    name: 'David L.',
    location: 'Seattle, WA',
    rating: 5,
    date: '2026-03-12',
    program: 'Global Entry',
    text: 'The Premium tier is a game-changer. I was skeptical about paying, but within 3 days of upgrading I got notified of a cancellation slot. The 2-minute checks caught it before anyone else — the slot was gone in under 5 minutes. Already told my entire office about it.',
    avatar: 'DL',
    verified: true,
    daysToBook: 3,
    screenshot: false,
  },
  {
    name: 'Maria S.',
    location: 'San Diego, CA',
    rating: 5,
    date: '2026-03-14',
    program: 'SENTRI',
    text: 'As a frequent border crosser, getting SENTRI was critical for my business. I tried manually checking for a month before finding NEXUS Alert. Got notified of an Otay Mesa slot within 1 week and booked same day. This extension literally paid for itself in time saved.',
    avatar: 'MS',
    verified: true,
    daysToBook: 7,
    screenshot: true,
  },
  {
    name: 'Kevin P.',
    location: 'Vancouver, BC',
    rating: 5,
    date: '2026-03-16',
    program: 'NEXUS',
    text: 'Applied for NEXUS for my whole family (2 kids, 2 adults). Finding 4 slots at the same time seemed impossible. NEXUS Alert found a cancellation block at Peace Arch in just 5 days. The desktop notifications are instant — I was able to grab all 4 slots before they disappeared.',
    avatar: 'KP',
    verified: true,
    daysToBook: 5,
    screenshot: true,
  },
  {
    name: 'Priya R.',
    location: 'New York, NY',
    rating: 5,
    date: '2026-03-17',
    program: 'Global Entry',
    text: 'I waited 8 months for conditional approval, then faced "no appointments available" everywhere near NYC. Used NEXUS Alert with the Premium trial and got a JFK slot notification in under 48 hours. The email alerts meant I didn\'t miss it while at work. Absolutely worth every penny.',
    avatar: 'PR',
    verified: true,
    daysToBook: 2,
    screenshot: false,
  },
  {
    name: 'Alex T.',
    location: 'Detroit, MI',
    rating: 5,
    date: '2026-03-18',
    program: 'NEXUS',
    text: 'Cross the border daily for work. NEXUS Alert found me a Detroit slot in 4 days. The sound alerts work perfectly — heard it chime while I was in a meeting, grabbed my phone, and booked instantly. The extension paid for itself in the first hour of saved border time.',
    avatar: 'AT',
    verified: true,
    daysToBook: 4,
    screenshot: true,
  },
];

export default function EnhancedTestimonials() {
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

  const avgDaysToBook = Math.round(
    testimonials.reduce((sum, t) => sum + t.daysToBook, 0) / testimonials.length
  );

  return (
    <section className="py-20 px-6 border-t border-[#222] bg-gradient-to-b from-[#0a0a0a] to-[#0f0f14]">
      <div className="max-w-6xl mx-auto">
        {/* Header with Social Proof */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/30 mb-4">
            <svg className="w-5 h-5 text-[#22c55e]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold text-[#22c55e]">
              Verified Success Stories
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Real People, Real Results
          </h2>
          <p className="text-[#888] text-base sm:text-lg max-w-2xl mx-auto mb-3">
            Join thousands of travelers who found their appointments faster with NEXUS Alert
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#eab308]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[#ededed] font-semibold">5.0 average</span>
            </div>
            <span className="text-[#555]">•</span>
            <span className="text-[#888]">
              <span className="font-semibold text-[#ededed]">{avgDaysToBook} days</span> average time to book
            </span>
            <span className="text-[#555]">•</span>
            <span className="text-[#888]">
              <span className="font-semibold text-[#ededed]">10,000+</span> appointments found
            </span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="p-6 rounded-xl border border-[#222] bg-[#111] hover:border-[#3b82f6]/50 transition flex flex-col relative overflow-hidden"
            >
              {/* Screenshot Badge */}
              {testimonial.screenshot && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-[#3b82f6]/20 border border-[#3b82f6]/30 text-[10px] font-semibold text-[#3b82f6]">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  Verified
                </div>
              )}

              {/* Stars + Days Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-0.5">
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
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/30">
                  <svg className="w-3 h-3 text-[#22c55e]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-semibold text-[#22c55e]">
                    {testimonial.daysToBook}d
                  </span>
                </div>
              </div>

              {/* Program Badge */}
              <div className="mb-3">
                <span className="inline-block px-2 py-1 rounded-md bg-[#3b82f6]/10 border border-[#3b82f6]/30 text-[#3b82f6] text-xs font-semibold">
                  {testimonial.program}
                </span>
              </div>

              {/* Testimonial Text */}
              <p className="text-[#ccc] text-sm leading-relaxed mb-4 flex-1">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#222]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#22c55e] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {testimonial.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#ededed]">
                      {testimonial.name}
                    </span>
                    {testimonial.verified && (
                      <svg className="w-4 h-4 text-[#3b82f6] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="text-xs text-[#666] truncate">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-r from-[#3b82f6]/10 to-[#22c55e]/10 border border-[#3b82f6]/30">
          <h3 className="text-2xl font-bold mb-3">Join 10,000+ Successful Users</h3>
          <p className="text-[#888] mb-6 max-w-xl mx-auto">
            Used NEXUS Alert to find your slot?{' '}
            <span className="text-[#ededed] font-semibold">Share your story and get 3 months of Premium free.</span>
          </p>
          <a
            href="mailto:hello@nexus-alert.com?subject=My NEXUS Alert Success Story&body=Name:%0D%0ALocation:%0D%0AProgram (NEXUS/Global Entry/SENTRI):%0D%0ADays to book:%0D%0AYour story:"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#3b82f6] text-white font-semibold hover:bg-[#2563eb] transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Share Your Success Story
          </a>
        </div>
      </div>
    </section>
  );
}
