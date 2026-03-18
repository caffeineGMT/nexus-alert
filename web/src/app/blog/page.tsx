import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'NEXUS Alert Blog - Tips, Guides & Updates for Trusted Traveler Programs',
  description:
    'Expert guides on NEXUS, Global Entry, and SENTRI appointments. Learn how to get interview slots faster, compare programs, and optimize your booking strategy.',
  openGraph: {
    title: 'NEXUS Alert Blog - Tips & Guides',
    description:
      'Expert guides on NEXUS, Global Entry, and SENTRI appointments.',
    url: 'https://nexus-alert.com/blog',
    siteName: 'NEXUS Alert',
    type: 'website',
  },
  alternates: {
    canonical: 'https://nexus-alert.com/blog',
  },
};

const blogPosts = [
  {
    slug: 'how-to-get-nexus-appointment-fast',
    title: 'How to Get a NEXUS Interview Appointment in 2026 (7 Proven Strategies)',
    excerpt:
      'Waiting months for a NEXUS appointment? Learn 7 data-backed strategies to book your interview slot weeks or even days sooner, including the #1 method that works 24/7.',
    date: '2026-03-18',
    readTime: '8 min read',
    category: 'Guides',
  },
  {
    slug: 'nexus-conditional-approval',
    title: 'NEXUS Conditional Approval: What Happens Next? (2026 Complete Guide)',
    excerpt:
      'Got NEXUS conditional approval? Learn exactly what happens next, how to book your interview, what documents to bring, and how to move from conditional to full approval fast.',
    date: '2026-03-18',
    readTime: '10 min read',
    category: 'Guides',
  },
  {
    slug: 'global-entry-vs-nexus-vs-sentri',
    title: 'Global Entry vs NEXUS vs SENTRI: Which Trusted Traveler Program is Right for You?',
    excerpt:
      'Confused about which Trusted Traveler Program to choose? This complete comparison breaks down costs, benefits, enrollment centers, and ideal use cases for each program.',
    date: '2026-03-18',
    readTime: '7 min read',
    category: 'Comparisons',
  },
  {
    slug: 'nexus-interview-locations',
    title: '7 NEXUS Interview Locations with Shortest Wait Times (2026 Data)',
    excerpt:
      'Which NEXUS enrollment centers have the best availability? Data analysis of appointment slot releases across all 13 locations to help you book faster.',
    date: '2026-03-18',
    readTime: '8 min read',
    category: 'Guides',
  },
  {
    slug: 'nexus-interview-tips',
    title: 'NEXUS Interview Tips: Everything You Need to Know to Pass',
    excerpt:
      'Ace your NEXUS interview on the first try. Complete guide covering required documents, interview questions, what to expect, common mistakes to avoid, and insider tips from successful applicants.',
    date: '2026-03-18',
    readTime: '9 min read',
    category: 'Guides',
  },
  {
    slug: 'best-times-to-check-nexus-appointments',
    title: 'Best Times to Check for NEXUS Appointments (Data-Driven Analysis)',
    excerpt:
      'When do NEXUS appointment slots appear most frequently? We analyzed thousands of slot releases to identify the optimal times to check for cancellations.',
    date: '2026-03-18',
    readTime: '6 min read',
    category: 'Data & Insights',
  },
  {
    slug: 'success-story-sarah-nexus-3-days',
    title: 'Success Story: How Sarah Got Her NEXUS Appointment in 3 Days',
    excerpt:
      'Sarah was manually checking for weeks with no luck. She installed NEXUS Alert on Friday and booked her appointment by Sunday morning. Read her full story.',
    date: '2026-03-10',
    readTime: '3 min read',
    category: 'Success Stories',
  },
  {
    slug: 'success-story-family-global-entry',
    title: 'Success Story: Family of 4 Books Global Entry in One Week',
    excerpt:
      'Finding 4 matching Global Entry slots at the same location seemed impossible. The Martinez family did it in 7 days using automated monitoring.',
    date: '2026-03-12',
    readTime: '4 min read',
    category: 'Success Stories',
  },
];

export default function BlogIndex() {
  return (
    <div className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            NEXUS Alert Blog
          </h1>
          <p className="text-lg text-[#888] max-w-2xl mx-auto">
            Expert tips, data-driven insights, and proven strategies for getting
            NEXUS, Global Entry, and SENTRI appointments faster.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="p-8 rounded-xl border border-[#222] bg-[#111] hover:border-[#3b82f6] transition group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold text-[#3b82f6] uppercase tracking-wide">
                  {post.category}
                </span>
                <span className="text-xs text-[#555]">•</span>
                <time className="text-xs text-[#555]">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span className="text-xs text-[#555]">•</span>
                <span className="text-xs text-[#555]">{post.readTime}</span>
              </div>
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-bold mb-3 group-hover:text-[#3b82f6] transition">
                  {post.title}
                </h2>
              </Link>
              <p className="text-[#888] mb-4 leading-relaxed">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-sm font-semibold text-[#3b82f6] hover:text-[#2563eb] transition"
              >
                Read full article
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 p-8 rounded-xl border border-[#3b82f6] bg-[#0f1729] text-center">
          <h2 className="text-2xl font-bold mb-3">
            Ready to book your NEXUS appointment faster?
          </h2>
          <p className="text-[#888] mb-6 max-w-xl mx-auto">
            Install NEXUS Alert and get instant notifications when appointment
            slots open up at your preferred enrollment centers.
          </p>
          <a
            href="https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#3b82f6] text-white font-semibold hover:bg-[#2563eb] transition"
          >
            Install Free Chrome Extension
          </a>
        </div>
      </div>
    </div>
  );
}
