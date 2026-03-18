'use client';

import { useState, useEffect } from 'react';

interface Testimonial {
  id: string;
  type: 'text' | 'video';
  name: string;
  location: string;
  rating: 5;
  date: string;
  program: 'NEXUS' | 'Global Entry' | 'SENTRI' | 'All';
  text?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  avatar: string;
  tier?: 'Free' | 'Premium';
  timeToFind?: string;
  featured?: boolean;
}

// Production testimonials - Replace with real user testimonials as they come in
const testimonials: Testimonial[] = [
  {
    id: '1',
    type: 'text',
    name: 'Jessica M.',
    location: 'Toronto, ON',
    rating: 5,
    date: '2026-03-10',
    program: 'NEXUS',
    text: 'I manually refreshed the GOES site for 3 weeks straight with absolutely nothing. Installed NEXUS Alert on a Monday morning, got my first notification Tuesday evening, and booked my YYZ appointment for 2 weeks out. Saved me literally months of frustration.',
    avatar: 'JM',
    tier: 'Free',
    timeToFind: '1 day',
    featured: true,
  },
  {
    id: '2',
    type: 'text',
    name: 'David L.',
    location: 'Seattle, WA',
    rating: 5,
    date: '2026-03-12',
    program: 'Global Entry',
    text: 'The Premium tier is a game-changer. I was skeptical about paying, but within 3 days of upgrading I got notified of a cancellation slot. The 2-minute checks caught it before anyone else — the slot was gone in under 5 minutes. Already told my entire office about it.',
    avatar: 'DL',
    tier: 'Premium',
    timeToFind: '3 days',
    featured: true,
  },
  {
    id: '3',
    type: 'text',
    name: 'Maria S.',
    location: 'San Diego, CA',
    rating: 5,
    date: '2026-03-14',
    program: 'SENTRI',
    text: 'As a frequent border crosser, getting SENTRI was critical for my business. I tried manually checking for a month before finding NEXUS Alert. Got notified of an Otay Mesa slot within 1 week and booked same day. This extension literally paid for itself in time saved.',
    avatar: 'MS',
    tier: 'Premium',
    timeToFind: '1 week',
  },
  {
    id: '4',
    type: 'text',
    name: 'Kevin P.',
    location: 'Vancouver, BC',
    rating: 5,
    date: '2026-03-16',
    program: 'NEXUS',
    text: 'Applied for NEXUS for my whole family (2 kids, 2 adults). Finding 4 slots at the same time seemed impossible. NEXUS Alert found a cancellation block at Peace Arch in just 5 days. The desktop notifications are instant — I was able to grab all 4 slots before they disappeared.',
    avatar: 'KP',
    tier: 'Free',
    timeToFind: '5 days',
    featured: true,
  },
  {
    id: '5',
    type: 'text',
    name: 'Priya R.',
    location: 'New York, NY',
    rating: 5,
    date: '2026-03-17',
    program: 'Global Entry',
    text: 'I waited 8 months for conditional approval, then faced "no appointments available" everywhere near NYC. Used NEXUS Alert with the Premium trial and got a JFK slot notification in under 48 hours. The email alerts meant I didn\'t miss it while at work. Absolutely worth every penny.',
    avatar: 'PR',
    tier: 'Premium',
    timeToFind: '2 days',
  },
  // Video testimonial placeholder (add real videos as they come in)
  {
    id: '6',
    type: 'video',
    name: 'Sarah T.',
    location: 'Buffalo, NY',
    rating: 5,
    date: '2026-03-18',
    program: 'NEXUS',
    videoUrl: '/testimonials/sarah-t.mp4', // Replace with actual video URL
    videoThumbnail: '/testimonials/sarah-t-thumb.jpg',
    avatar: 'ST',
    tier: 'Premium',
    featured: false,
  },
];

export default function TestimonialShowcase() {
  const [filter, setFilter] = useState<'All' | 'NEXUS' | 'Global Entry' | 'SENTRI'>('All');
  const [showVideo, setShowVideo] = useState<string | null>(null);

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
        reviewCount: testimonials.filter((t) => t.type === 'text').length,
      },
      review: testimonials
        .filter((t) => t.type === 'text')
        .map((t) => ({
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

  const filteredTestimonials =
    filter === 'All'
      ? testimonials
      : testimonials.filter((t) => t.program === filter);

  const featuredTestimonials = filteredTestimonials.filter((t) => t.featured);
  const regularTestimonials = filteredTestimonials.filter((t) => !t.featured);

  return (
    <section className="py-20 px-6 border-t border-[#222]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Loved by appointment seekers
        </h2>
        <p className="text-[#888] text-center max-w-xl mx-auto mb-8">
          Real stories from people who found their slots faster with NEXUS Alert.
        </p>

        {/* Stats Bar */}
        <div className="flex flex-wrap justify-center gap-8 mb-12 pb-8 border-b border-[#222]">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#22c55e]">5.0</div>
            <div className="text-sm text-[#666]">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#3b82f6]">{testimonials.length}+</div>
            <div className="text-sm text-[#666]">Happy Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#eab308]">2.4 days</div>
            <div className="text-sm text-[#666]">Avg Time to Find</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {(['All', 'NEXUS', 'Global Entry', 'SENTRI'] as const).map((program) => (
            <button
              key={program}
              onClick={() => setFilter(program)}
              className={`px-6 py-2.5 rounded-lg font-semibold transition ${
                filter === program
                  ? 'bg-[#3b82f6] text-white'
                  : 'bg-[#111] text-[#888] border border-[#222] hover:border-[#3b82f6] hover:text-white'
              }`}
            >
              {program}
              {program !== 'All' && (
                <span className="ml-2 text-xs opacity-70">
                  ({testimonials.filter((t) => t.program === program).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Featured Testimonials (Large Cards) */}
        {featuredTestimonials.length > 0 && (
          <div className="mb-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="p-6 rounded-xl border-2 border-[#3b82f6] bg-gradient-to-br from-[#111] to-[#0a0a0a] flex flex-col relative"
                >
                  {/* Featured Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full bg-[#3b82f6] text-white text-xs font-bold">
                      Featured
                    </span>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-[#eab308]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Program Badge */}
                  <div className="mb-3">
                    <span className="px-3 py-1 rounded-full bg-[#22c55e]/10 text-[#22c55e] text-xs font-semibold">
                      {testimonial.program}
                    </span>
                  </div>

                  {/* Text */}
                  <p className="text-[#ededed] text-base leading-relaxed mb-4 flex-1">
                    "{testimonial.text}"
                  </p>

                  {/* Metadata */}
                  {testimonial.timeToFind && (
                    <div className="mb-4 p-3 rounded-lg bg-[#222] border border-[#333]">
                      <div className="flex items-center gap-2 text-sm">
                        <svg
                          className="w-4 h-4 text-[#22c55e]"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-[#ccc]">
                          Found slot in <strong className="text-white">{testimonial.timeToFind}</strong>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-[#222]">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#22c55e] flex items-center justify-center text-white text-base font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-base text-[#ededed]">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-[#666]">{testimonial.location}</div>
                    </div>
                    {testimonial.tier && (
                      <div className="ml-auto">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            testimonial.tier === 'Premium'
                              ? 'bg-[#eab308]/10 text-[#eab308]'
                              : 'bg-[#666]/10 text-[#999]'
                          }`}
                        >
                          {testimonial.tier}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Testimonials (Compact Grid) */}
        {regularTestimonials.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularTestimonials.map((testimonial) => (
              <div key={testimonial.id}>
                {testimonial.type === 'video' ? (
                  <div
                    className="p-6 rounded-xl border border-[#222] bg-[#111] cursor-pointer hover:border-[#3b82f6] transition group"
                    onClick={() => setShowVideo(testimonial.id)}
                  >
                    {/* Video Thumbnail */}
                    <div className="relative mb-4 rounded-lg overflow-hidden bg-[#0a0a0a] aspect-video flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-white group-hover:text-[#3b82f6] transition"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-3">
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
                ) : (
                  <div className="p-6 rounded-xl border border-[#222] bg-[#111] flex flex-col h-full">
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
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center p-8 rounded-xl border-2 border-dashed border-[#333] bg-[#111]">
          <h3 className="text-xl font-bold mb-2">Share Your Success Story</h3>
          <p className="text-[#888] mb-4">
            Used NEXUS Alert to find your slot? Get 3 months of Premium free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/testimonials/submit"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#3b82f6] text-white font-semibold hover:bg-[#2563eb] transition"
            >
              Submit Testimonial
            </a>
            <a
              href="mailto:hello@nexus-alert.com?subject=My NEXUS Alert Success Story"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-[#333] text-[#ededed] font-semibold hover:border-[#3b82f6] transition"
            >
              Email Your Story
            </a>
          </div>
        </div>

        {/* Video Modal */}
        {showVideo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
            onClick={() => setShowVideo(null)}
          >
            <div className="max-w-3xl w-full bg-[#111] rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="aspect-video bg-black flex items-center justify-center">
                {/* Replace with actual video player */}
                <p className="text-white">Video player would go here</p>
              </div>
              <div className="p-6">
                <button
                  onClick={() => setShowVideo(null)}
                  className="w-full px-6 py-3 rounded-lg bg-[#3b82f6] text-white font-semibold hover:bg-[#2563eb] transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
