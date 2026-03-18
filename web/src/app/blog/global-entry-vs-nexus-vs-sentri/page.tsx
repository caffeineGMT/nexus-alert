import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Global Entry vs NEXUS vs SENTRI: Which Trusted Traveler Program is Right for You? (2026)',
  description:
    'Complete comparison of Global Entry, NEXUS, and SENTRI programs. Compare costs, benefits, enrollment centers, and ideal use cases to choose the right program.',
  keywords: [
    'global entry vs nexus',
    'nexus vs sentri',
    'global entry vs sentri',
    'trusted traveler program comparison',
    'nexus benefits',
    'global entry benefits',
    'sentri benefits',
    'tsa precheck comparison',
  ],
  openGraph: {
    title: 'Global Entry vs NEXUS vs SENTRI: Complete Comparison (2026)',
    description:
      'Compare costs, benefits, and enrollment centers to choose the right Trusted Traveler Program.',
    url: 'https://nexus-alert.com/blog/global-entry-vs-nexus-vs-sentri',
    siteName: 'NEXUS Alert',
    type: 'article',
    publishedTime: '2026-03-18T08:00:00.000Z',
    authors: ['NEXUS Alert Team'],
  },
  alternates: {
    canonical: 'https://nexus-alert.com/blog/global-entry-vs-nexus-vs-sentri',
  },
};

export default function GlobalEntryVsNexusVsSentri() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Global Entry vs NEXUS vs SENTRI: Which Trusted Traveler Program is Right for You?',
    description:
      'Complete comparison of Global Entry, NEXUS, and SENTRI programs including costs, benefits, enrollment centers, and ideal use cases.',
    image: 'https://nexus-alert.com/og-image.png',
    datePublished: '2026-03-18T08:00:00.000Z',
    dateModified: '2026-03-18T08:00:00.000Z',
    author: {
      '@type': 'Organization',
      name: 'NEXUS Alert',
      url: 'https://nexus-alert.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'NEXUS Alert',
      logo: {
        '@type': 'ImageObject',
        url: 'https://nexus-alert.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://nexus-alert.com/blog/global-entry-vs-nexus-vs-sentri',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold text-[#3b82f6] uppercase tracking-wide">
                Comparisons
              </span>
              <span className="text-xs text-[#555]">•</span>
              <time className="text-xs text-[#555]">March 18, 2026</time>
              <span className="text-xs text-[#555]">•</span>
              <span className="text-xs text-[#555]">7 min read</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Global Entry vs NEXUS vs SENTRI: Which Trusted Traveler Program is Right
              for You?
            </h1>
            <p className="text-xl text-[#888] leading-relaxed">
              Confused about which Trusted Traveler Program to apply for? This complete
              comparison breaks down costs, benefits, enrollment locations, and ideal
              use cases for Global Entry, NEXUS, and SENTRI to help you make the right
              choice.
            </p>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">
                Quick Comparison Table
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#333]">
                      <th className="text-left py-3 px-4 font-bold text-[#ededed]">
                        Feature
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-[#3b82f6]">
                        Global Entry
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-[#22c55e]">
                        NEXUS
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-[#f59e0b]">
                        SENTRI
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[#888]">
                    <tr className="border-b border-[#222]">
                      <td className="py-3 px-4 font-medium text-[#ededed]">Cost</td>
                      <td className="py-3 px-4">$100</td>
                      <td className="py-3 px-4 text-[#22c55e] font-semibold">$50</td>
                      <td className="py-3 px-4">$122.25</td>
                    </tr>
                    <tr className="border-b border-[#222]">
                      <td className="py-3 px-4 font-medium text-[#ededed]">
                        Valid For
                      </td>
                      <td className="py-3 px-4">5 years</td>
                      <td className="py-3 px-4">5 years</td>
                      <td className="py-3 px-4">5 years</td>
                    </tr>
                    <tr className="border-b border-[#222]">
                      <td className="py-3 px-4 font-medium text-[#ededed]">
                        TSA PreCheck
                      </td>
                      <td className="py-3 px-4">✅ Included</td>
                      <td className="py-3 px-4">✅ Included</td>
                      <td className="py-3 px-4">✅ Included</td>
                    </tr>
                    <tr className="border-b border-[#222]">
                      <td className="py-3 px-4 font-medium text-[#ededed]">
                        International Fast-Track
                      </td>
                      <td className="py-3 px-4">✅ Returning to US</td>
                      <td className="py-3 px-4">✅ US & Canada</td>
                      <td className="py-3 px-4">✅ Returning to US</td>
                    </tr>
                    <tr className="border-b border-[#222]">
                      <td className="py-3 px-4 font-medium text-[#ededed]">
                        Border Crossing Lanes
                      </td>
                      <td className="py-3 px-4">❌ No</td>
                      <td className="py-3 px-4">✅ US-Canada</td>
                      <td className="py-3 px-4">✅ US-Mexico</td>
                    </tr>
                    <tr className="border-b border-[#222]">
                      <td className="py-3 px-4 font-medium text-[#ededed]">
                        Best For
                      </td>
                      <td className="py-3 px-4">International air travelers</td>
                      <td className="py-3 px-4">Canada border crossers</td>
                      <td className="py-3 px-4">Mexico border crossers</td>
                    </tr>
                    <tr className="border-b border-[#222]">
                      <td className="py-3 px-4 font-medium text-[#ededed]">
                        Enrollment Centers
                      </td>
                      <td className="py-3 px-4">130+ locations</td>
                      <td className="py-3 px-4">13 border locations</td>
                      <td className="py-3 px-4">15 border locations</td>
                    </tr>
                    <tr className="border-b border-[#222]">
                      <td className="py-3 px-4 font-medium text-[#ededed]">
                        Processing Time
                      </td>
                      <td className="py-3 px-4">4-6 weeks</td>
                      <td className="py-3 px-4">4-6 weeks</td>
                      <td className="py-3 px-4">4-6 weeks</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-[#ededed]">
                Detailed Program Breakdown
              </h2>

              {/* Global Entry */}
              <div className="mb-10 p-6 rounded-xl border border-[#3b82f6] bg-[#0f1729]">
                <h3 className="text-2xl font-bold mb-4 text-[#3b82f6]">
                  Global Entry
                </h3>
                <p className="text-[#888] leading-relaxed mb-4">
                  Global Entry is the most popular Trusted Traveler Program, designed
                  for frequent international air travelers returning to the United
                  States.
                </p>
                <h4 className="font-bold mb-2 text-[#ededed]">What You Get:</h4>
                <ul className="list-disc list-inside text-[#888] space-y-1 mb-4">
                  <li>Expedited customs screening when returning to the US by air</li>
                  <li>Use automated kiosks at major airports (skip the customs line)</li>
                  <li>TSA PreCheck included (expedited domestic security)</li>
                  <li>Valid at 130+ enrollment centers nationwide</li>
                  <li>Mobile Passport Control (MPC) access</li>
                </ul>
                <h4 className="font-bold mb-2 text-[#ededed]">Best For:</h4>
                <ul className="list-disc list-inside text-[#888] space-y-1 mb-4">
                  <li>Frequent international business travelers</li>
                  <li>People who fly internationally 3+ times per year</li>
                  <li>Travelers who don't regularly cross US land borders</li>
                  <li>Anyone who wants the widest enrollment center availability</li>
                </ul>
                <h4 className="font-bold mb-2 text-[#ededed]">Limitations:</h4>
                <ul className="list-disc list-inside text-[#888] space-y-1">
                  <li>Does NOT include dedicated land border crossing lanes</li>
                  <li>Higher cost than NEXUS ($100 vs $50)</li>
                  <li>
                    No benefits when entering Canada (only when returning to US)
                  </li>
                </ul>
              </div>

              {/* NEXUS */}
              <div className="mb-10 p-6 rounded-xl border border-[#22c55e] bg-[#0f1911]">
                <h3 className="text-2xl font-bold mb-4 text-[#22c55e]">NEXUS</h3>
                <p className="text-[#888] leading-relaxed mb-4">
                  NEXUS is a joint US-Canada program that provides expedited processing
                  at air, land, and sea borders between the two countries. It's the
                  best value among all Trusted Traveler Programs.
                </p>
                <h4 className="font-bold mb-2 text-[#ededed]">What You Get:</h4>
                <ul className="list-disc list-inside text-[#888] space-y-1 mb-4">
                  <li>All Global Entry benefits (air, customs, TSA PreCheck)</li>
                  <li>
                    Dedicated NEXUS lanes at US-Canada land border crossings (huge time
                    savings)
                  </li>
                  <li>
                    Expedited processing when flying between US and Canada (both
                    directions)
                  </li>
                  <li>Marine NEXUS lanes for boat travelers</li>
                  <li>Half the cost of Global Entry ($50 vs $100)</li>
                </ul>
                <h4 className="font-bold mb-2 text-[#ededed]">Best For:</h4>
                <ul className="list-disc list-inside text-[#888] space-y-1 mb-4">
                  <li>Anyone who crosses the US-Canada border regularly</li>
                  <li>
                    International travelers who also visit Canada (you get benefits in
                    both countries)
                  </li>
                  <li>Budget-conscious travelers who want maximum value</li>
                  <li>People near US-Canada border cities (Detroit, Seattle, Buffalo)</li>
                </ul>
                <h4 className="font-bold mb-2 text-[#ededed]">Limitations:</h4>
                <ul className="list-disc list-inside text-[#888] space-y-1 mb-4">
                  <li>
                    Requires interview at a US-Canada border location (fewer enrollment
                    centers)
                  </li>
                  <li>
                    Both US and Canadian customs must approve you (dual screening
                    process)
                  </li>
                  <li>Appointments can be harder to get due to limited locations</li>
                </ul>
                <div className="mt-4 p-4 bg-[#0a0a0a] rounded-lg border border-[#22c55e]">
                  <p className="text-[#888] text-sm">
                    <strong className="text-[#ededed]">Pro Tip:</strong> If you cross
                    the US-Canada border even just 2-3 times per year, NEXUS pays for
                    itself immediately. The time savings at land borders alone are worth
                    it—NEXUS lanes can save you 1-2 hours during peak crossing times.
                  </p>
                </div>
              </div>

              {/* SENTRI */}
              <div className="mb-10 p-6 rounded-xl border border-[#f59e0b] bg-[#1f1708]">
                <h3 className="text-2xl font-bold mb-4 text-[#f59e0b]">SENTRI</h3>
                <p className="text-[#888] leading-relaxed mb-4">
                  SENTRI (Secure Electronic Network for Travelers Rapid Inspection) is
                  designed for frequent travelers crossing the US-Mexico border.
                </p>
                <h4 className="font-bold mb-2 text-[#ededed]">What You Get:</h4>
                <ul className="list-disc list-inside text-[#888] space-y-1 mb-4">
                  <li>All Global Entry benefits (air, customs, TSA PreCheck)</li>
                  <li>
                    Dedicated SENTRI lanes at US-Mexico land border crossings (massive
                    time savings)
                  </li>
                  <li>
                    Expedited processing at pedestrian crossings (Ready Lanes for
                    walkers)
                  </li>
                  <li>Vehicle registration for SENTRI lanes</li>
                  <li>Valid at all Global Entry kiosks nationwide</li>
                </ul>
                <h4 className="font-bold mb-2 text-[#ededed]">Best For:</h4>
                <ul className="list-disc list-inside text-[#888] space-y-1 mb-4">
                  <li>Anyone who crosses the US-Mexico border regularly</li>
                  <li>
                    Business travelers or residents in border cities (San Diego, El
                    Paso, Laredo)
                  </li>
                  <li>People who drive across the border frequently</li>
                  <li>Frequent visitors to Mexico who need fast re-entry to the US</li>
                </ul>
                <h4 className="font-bold mb-2 text-[#ededed]">Limitations:</h4>
                <ul className="list-disc list-inside text-[#888] space-y-1 mb-4">
                  <li>Highest cost among all programs ($122.25)</li>
                  <li>
                    Requires interview at a US-Mexico border location (limited to
                    southwestern US)
                  </li>
                  <li>Vehicle must be registered separately (additional process)</li>
                  <li>
                    Does NOT provide benefits when entering Mexico (only returning to
                    US)
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-[#0a0a0a] rounded-lg border border-[#f59e0b]">
                  <p className="text-[#888] text-sm">
                    <strong className="text-[#ededed]">Important:</strong> If you cross
                    the US-Mexico border during peak times (mornings, weekends), SENTRI
                    can save you 2-4 hours per crossing. Standard lanes can have 2-3
                    hour waits, while SENTRI lanes average 5-15 minutes.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">
                Which Program Should You Choose?
              </h2>
              <p className="text-[#888] leading-relaxed mb-6">
                The right program depends entirely on your travel patterns. Here's a
                simple decision tree:
              </p>

              <div className="space-y-6">
                <div className="p-6 rounded-xl border border-[#22c55e] bg-[#0f1911]">
                  <h3 className="text-xl font-bold mb-2 text-[#22c55e]">
                    Choose NEXUS if:
                  </h3>
                  <ul className="list-disc list-inside text-[#888] space-y-1">
                    <li>You cross the US-Canada border 2+ times per year (by any mode)</li>
                    <li>You travel internationally AND visit Canada occasionally</li>
                    <li>You want the best value (all benefits for half the cost)</li>
                    <li>You're willing to travel to a border location for your interview</li>
                  </ul>
                  <p className="text-[#888] mt-4 text-sm italic">
                    NEXUS is the best deal for most people. Even if you only visit Canada
                    once or twice a year, it includes everything Global Entry offers at
                    half the price.
                  </p>
                </div>

                <div className="p-6 rounded-xl border border-[#3b82f6] bg-[#0f1729]">
                  <h3 className="text-xl font-bold mb-2 text-[#3b82f6]">
                    Choose Global Entry if:
                  </h3>
                  <ul className="list-disc list-inside text-[#888] space-y-1">
                    <li>
                      You travel internationally frequently but rarely visit Canada or
                      Mexico
                    </li>
                    <li>You need a convenient enrollment center location (130+ options)</li>
                    <li>You can't easily get to a US-Canada border for NEXUS interview</li>
                    <li>
                      You prioritize convenience over cost (NEXUS requires border
                      interview)
                    </li>
                  </ul>
                  <p className="text-[#888] mt-4 text-sm italic">
                    Global Entry makes sense if you fly internationally often but never
                    cross land borders, or if getting to a border enrollment center is
                    impractical.
                  </p>
                </div>

                <div className="p-6 rounded-xl border border-[#f59e0b] bg-[#1f1708]">
                  <h3 className="text-xl font-bold mb-2 text-[#f59e0b]">
                    Choose SENTRI if:
                  </h3>
                  <ul className="list-disc list-inside text-[#888] space-y-1">
                    <li>You cross the US-Mexico border regularly (weekly or monthly)</li>
                    <li>You live or work near the US-Mexico border</li>
                    <li>You drive across the border frequently</li>
                    <li>Time savings at border crossings are critical for you</li>
                  </ul>
                  <p className="text-[#888] mt-4 text-sm italic">
                    SENTRI is essential if you're a frequent US-Mexico border crosser. The
                    time savings alone justify the higher cost if you cross even once per
                    month.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">
                Can You Have Multiple Programs?
              </h2>
              <p className="text-[#888] leading-relaxed mb-4">
                Yes! You can hold multiple Trusted Traveler memberships simultaneously.
                In fact, many frequent travelers have both NEXUS and SENTRI if they
                cross both the Canadian and Mexican borders.
              </p>
              <div className="bg-[#111] border border-[#222] rounded-lg p-6">
                <h4 className="font-bold mb-2 text-[#ededed]">Common Combinations:</h4>
                <ul className="list-disc list-inside text-[#888] space-y-2">
                  <li>
                    <strong className="text-[#ededed]">NEXUS + SENTRI:</strong> For people
                    who cross both northern and southern borders
                  </li>
                  <li>
                    <strong className="text-[#ededed]">Global Entry + SENTRI:</strong> For
                    international travelers who also frequently visit Mexico
                  </li>
                </ul>
                <p className="text-[#888] mt-4 text-sm">
                  <strong className="text-[#ededed]">Note:</strong> You don't need Global
                  Entry if you have NEXUS or SENTRI—both include all Global Entry
                  benefits. Only get multiple programs if you need the specific border
                  lane access they provide.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">
                How to Get an Appointment Faster
              </h2>
              <p className="text-[#888] leading-relaxed mb-4">
                Regardless of which program you choose, getting an interview appointment
                can take months. Slots fill up quickly, especially at popular enrollment
                centers.
              </p>
              <p className="text-[#888] leading-relaxed mb-4">
                The fastest way to book an appointment is to use{' '}
                <a
                  href="https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID"
                  className="text-[#3b82f6] hover:text-[#2563eb] font-semibold underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NEXUS Alert
                </a>
                , which monitors all three programs (NEXUS, Global Entry, and SENTRI) and
                notifies you instantly when slots open up due to cancellations.
              </p>
              <div className="bg-[#0f1729] border border-[#3b82f6] rounded-lg p-6">
                <h4 className="font-bold mb-2 text-[#ededed]">
                  NEXUS Alert monitors:
                </h4>
                <ul className="list-disc list-inside text-[#888] space-y-1">
                  <li>All 13 NEXUS enrollment centers</li>
                  <li>All 130+ Global Entry enrollment centers</li>
                  <li>All 15 SENTRI enrollment centers</li>
                  <li>Multiple locations simultaneously</li>
                  <li>Custom date and time filters</li>
                </ul>
                <p className="text-[#888] mt-4">
                  Most users find appointments 2-8 weeks sooner compared to manual
                  checking.{' '}
                  <a
                    href="/blog/how-to-get-nexus-appointment-fast"
                    className="text-[#3b82f6] hover:text-[#2563eb] font-semibold underline"
                  >
                    Learn more about booking strategies →
                  </a>
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">
                Bottom Line
              </h2>
              <p className="text-[#888] leading-relaxed mb-4">
                For most people, <strong className="text-[#ededed]">NEXUS is the best
                choice</strong>. It includes all Global Entry benefits plus US-Canada
                border lane access at half the cost. Even if you only visit Canada
                occasionally, it's better value than Global Entry.
              </p>
              <p className="text-[#888] leading-relaxed mb-4">
                Choose <strong className="text-[#ededed]">Global Entry</strong> only if
                you can't get to a border location for the NEXUS interview, or if you
                never cross the Canadian border.
              </p>
              <p className="text-[#888] leading-relaxed">
                Choose <strong className="text-[#ededed]">SENTRI</strong> if you cross
                the US-Mexico border regularly—the time savings are massive and worth
                the higher cost.
              </p>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 rounded-xl border border-[#3b82f6] bg-[#0f1729] text-center">
            <h2 className="text-2xl font-bold mb-3">
              Ready to Apply for Your Trusted Traveler Program?
            </h2>
            <p className="text-[#888] mb-6 max-w-xl mx-auto">
              Book your interview appointment faster with NEXUS Alert. Get instant
              notifications when slots open up at your preferred enrollment centers.
            </p>
            <a
              href="https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#3b82f6] text-white font-semibold hover:bg-[#2563eb] transition"
            >
              Install NEXUS Alert — Free
            </a>
          </div>

          {/* Related Articles */}
          <div className="mt-16 pt-12 border-t border-[#222]">
            <h3 className="text-xl font-bold mb-6">Related Articles</h3>
            <div className="space-y-4">
              <Link
                href="/blog/how-to-get-nexus-appointment-fast"
                className="block p-4 rounded-lg border border-[#222] hover:border-[#3b82f6] transition"
              >
                <h4 className="font-semibold mb-1 text-[#ededed]">
                  How to Get a NEXUS Appointment Fast (7 Proven Strategies)
                </h4>
                <p className="text-sm text-[#888]">
                  Book your interview weeks sooner with these data-backed strategies
                </p>
              </Link>
              <Link
                href="/blog/best-times-to-check-nexus-appointments"
                className="block p-4 rounded-lg border border-[#222] hover:border-[#3b82f6] transition"
              >
                <h4 className="font-semibold mb-1 text-[#ededed]">
                  Best Times to Check for NEXUS Appointments (Data Analysis)
                </h4>
                <p className="text-sm text-[#888]">
                  When do slots appear most frequently? Data from thousands of releases
                </p>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
