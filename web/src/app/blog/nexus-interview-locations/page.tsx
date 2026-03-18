import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'NEXUS Interview Locations: Which Enrollment Center Has the Shortest Wait? (2026)',
  description:
    'Compare all 13 NEXUS enrollment centers by wait time, location, and availability. Find the fastest way to get your NEXUS interview appointment in 2026.',
  keywords: [
    'nexus enrollment centers',
    'nexus interview locations',
    'where to get nexus interview',
    'nexus application centers',
    'fastest nexus enrollment center',
    'nexus interview wait times',
    'nexus locations',
  ],
  openGraph: {
    title: 'NEXUS Interview Locations: Which Has Shortest Wait Times?',
    description:
      'Compare all 13 NEXUS enrollment centers by availability and wait times. Find the fastest location for your interview.',
    url: 'https://nexus-alert.com/blog/nexus-interview-locations',
    siteName: 'NEXUS Alert',
    type: 'article',
    publishedTime: '2026-03-18T10:00:00.000Z',
    authors: ['NEXUS Alert Team'],
  },
  alternates: {
    canonical: 'https://nexus-alert.com/blog/nexus-interview-locations',
  },
};

export default function NexusInterviewLocations() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'NEXUS Interview Locations: Which Enrollment Center Has the Shortest Wait? (2026)',
    description:
      'Compare all 13 NEXUS enrollment centers by wait time and availability.',
    image: 'https://nexus-alert.com/og-image.png',
    datePublished: '2026-03-18T10:00:00.000Z',
    dateModified: '2026-03-18T10:00:00.000Z',
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
      '@id': 'https://nexus-alert.com/blog/nexus-interview-locations',
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
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold text-[#3b82f6] uppercase tracking-wide">
                Location Guides
              </span>
              <span className="text-xs text-[#555]">•</span>
              <time className="text-xs text-[#555]">March 18, 2026</time>
              <span className="text-xs text-[#555]">•</span>
              <span className="text-xs text-[#555]">12 min read</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              NEXUS Interview Locations: Which Enrollment Center Has the Shortest Wait Times?
            </h1>
            <p className="text-xl text-[#888] leading-relaxed">
              Not all NEXUS enrollment centers are created equal. Some have wait times of 6+ months, while others have slots available in weeks. Here's the complete breakdown of all 13 locations to help you choose the fastest option.
            </p>
          </header>

          <div className="prose prose-invert prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-[#ededed]">
                All 13 NEXUS Enrollment Centers (Ranked by Wait Time)
              </h2>
              <p className="text-[#888] leading-relaxed mb-6">
                Based on data from thousands of appointment searches, here are the NEXUS enrollment centers ranked from fastest to slowest availability. <strong className="text-[#ededed]">Note:</strong> Wait times fluctuate throughout the year, especially during peak travel seasons.
              </p>

              <div className="space-y-8">
                {/* #1 Calais */}
                <div className="bg-[#111] border border-[#222] rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-[#3b82f6]">1. Calais, Maine</h3>
                      <p className="text-sm text-[#555]">US Port of Entry</p>
                    </div>
                    <span className="px-3 py-1 bg-[#22c55e]/20 text-[#22c55e] text-xs font-bold rounded-full">
                      FASTEST
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-[#555]">Average Wait Time</p>
                      <p className="text-[#ededed] font-bold">6-10 weeks</p>
                    </div>
                    <div>
                      <p className="text-[#555]">Closest Major City</p>
                      <p className="text-[#ededed]">Bangor, ME (1.5 hrs)</p>
                    </div>
                  </div>
                  <p className="text-[#888] mb-3">
                    <strong className="text-[#ededed]">Why it's fast:</strong> Remote location with far less demand than major border crossings. Serves northeastern New England.
                  </p>
                  <p className="text-[#888]">
                    <strong className="text-[#ededed]">Best for:</strong> New England residents willing to make the drive; people in Boston, Portland, or New Hampshire who want the fastest appointment.
                  </p>
                </div>

                {/* #2 Sweetgrass */}
                <div className="bg-[#111] border border-[#222] rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-[#ededed]">2. Sweetgrass, Montana</h3>
                      <p className="text-sm text-[#555]">US Port of Entry</p>
                    </div>
                    <span className="px-3 py-1 bg-[#22c55e]/20 text-[#22c55e] text-xs font-bold rounded-full">
                      VERY FAST
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-[#555]">Average Wait Time</p>
                      <p className="text-[#ededed] font-bold">8-12 weeks</p>
                    </div>
                    <div>
                      <p className="text-[#555]">Closest Major City</p>
                      <p className="text-[#ededed]">Great Falls, MT (2 hrs)</p>
                    </div>
                  </div>
                  <p className="text-[#888] mb-3">
                    <strong className="text-[#ededed]">Why it's fast:</strong> Rural Montana location means low applicant volume. Alternative for Pacific Northwest travelers.
                  </p>
                  <p className="text-[#888]">
                    <strong className="text-[#ededed]">Best for:</strong> Montana residents, Pacific Northwest applicants willing to fly/drive to Montana for a faster appointment.
                  </p>
                </div>

                {/* #3 Fort Erie */}
                <div className="bg-[#111] border border-[#222] rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-[#ededed]">3. Fort Erie, Ontario</h3>
                      <p className="text-sm text-[#555]">Canadian Port of Entry</p>
                    </div>
                    <span className="px-3 py-1 bg-[#22c55e]/20 text-[#22c55e] text-xs font-bold rounded-full">
                      FAST
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-[#555]">Average Wait Time</p>
                      <p className="text-[#ededed] font-bold">10-14 weeks</p>
                    </div>
                    <div>
                      <p className="text-[#555]">Closest Major City</p>
                      <p className="text-[#ededed]">Buffalo, NY (30 min)</p>
                    </div>
                  </div>
                  <p className="text-[#888] mb-3">
                    <strong className="text-[#ededed]">Why it's fast:</strong> Less congested than nearby Niagara Falls center. Same Niagara region access.
                  </p>
                  <p className="text-[#888]">
                    <strong className="text-[#ededed]">Best for:</strong> Buffalo and western New York applicants; alternative to the packed Niagara Falls center.
                  </p>
                </div>

                {/* #4 Champlain */}
                <div className="bg-[#111] border border-[#222] rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-[#ededed]">4. Champlain, New York</h3>
                      <p className="text-sm text-[#555]">US Port of Entry</p>
                    </div>
                    <span className="px-3 py-1 bg-[#fbbf24]/20 text-[#fbbf24] text-xs font-bold rounded-full">
                      MODERATE
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-[#555]">Average Wait Time</p>
                      <p className="text-[#ededed] font-bold">12-16 weeks</p>
                    </div>
                    <div>
                      <p className="text-[#555]">Closest Major City</p>
                      <p className="text-[#ededed]">Burlington, VT (1 hr)</p>
                    </div>
                  </div>
                  <p className="text-[#888] mb-3">
                    <strong className="text-[#ededed]">Why it's moderate:</strong> Serves Montreal metro area and upstate New York; moderate demand.
                  </p>
                  <p className="text-[#888]">
                    <strong className="text-[#ededed]">Best for:</strong> Vermont, upstate New York, and northern New Hampshire residents.
                  </p>
                </div>

                {/* #5 Lansdowne */}
                <div className="bg-[#111] border border-[#222] rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-[#ededed]">5. Lansdowne, Ontario (Thousand Islands Bridge)</h3>
                      <p className="text-sm text-[#555]">Canadian Port of Entry</p>
                    </div>
                    <span className="px-3 py-1 bg-[#fbbf24]/20 text-[#fbbf24] text-xs font-bold rounded-full">
                      MODERATE
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-[#555]">Average Wait Time</p>
                      <p className="text-[#ededed] font-bold">14-18 weeks</p>
                    </div>
                    <div>
                      <p className="text-[#555]">Closest Major City</p>
                      <p className="text-[#ededed]">Syracuse, NY (1.5 hrs)</p>
                    </div>
                  </div>
                  <p className="text-[#888] mb-3">
                    <strong className="text-[#ededed]">Why it's moderate:</strong> Scenic location between New York and Ontario; moderate traffic.
                  </p>
                  <p className="text-[#888]">
                    <strong className="text-[#ededed]">Best for:</strong> Central New York and eastern Ontario applicants.
                  </p>
                </div>

                {/* Divider */}
                <div className="bg-[#0f1729] border border-[#3b82f6] rounded-lg p-6 text-center">
                  <p className="text-[#888]">
                    <strong className="text-[#ededed]">💡 Pro Tip:</strong> The fastest way to get an appointment at <em>any</em> location is to use{' '}
                    <a
                      href="https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID"
                      className="text-[#3b82f6] hover:text-[#2563eb] font-semibold underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      NEXUS Alert
                    </a>
                    . It monitors all 13 centers 24/7 and notifies you instantly when slots open up. Most users book 4-8 weeks sooner than manual checking.
                  </p>
                </div>

                {/* #6 Blaine */}
                <div className="bg-[#111] border border-[#222] rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-[#ededed]">6. Blaine, Washington (Peace Arch)</h3>
                      <p className="text-sm text-[#555]">US Port of Entry</p>
                    </div>
                    <span className="px-3 py-1 bg-[#f97316]/20 text-[#f97316] text-xs font-bold rounded-full">
                      HIGH DEMAND
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-[#555]">Average Wait Time</p>
                      <p className="text-[#ededed] font-bold">18-24 weeks</p>
                    </div>
                    <div>
                      <p className="text-[#555]">Closest Major City</p>
                      <p className="text-[#ededed]">Seattle, WA (2 hrs)</p>
                    </div>
                  </div>
                  <p className="text-[#888] mb-3">
                    <strong className="text-[#ededed]">Why it's crowded:</strong> Serves Seattle, Vancouver, and the entire Pacific Northwest. One of the busiest NEXUS crossing points.
                  </p>
                  <p className="text-[#888]">
                    <strong className="text-[#ededed]">Best for:</strong> Pacific Northwest residents who can't travel to Sweetgrass, Montana. Consider{' '}
                    <Link href="/blog/how-to-get-nexus-appointment-fast" className="text-[#3b82f6] hover:text-[#2563eb] underline">
                      automated monitoring
                    </Link>{' '}
                    for faster results.
                  </p>
                </div>

                {/* #7 Detroit */}
                <div className="bg-[#111] border border-[#222] rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-[#ededed]">7. Detroit, Michigan</h3>
                      <p className="text-sm text-[#555]">US Port of Entry</p>
                    </div>
                    <span className="px-3 py-1 bg-[#f97316]/20 text-[#f97316] text-xs font-bold rounded-full">
                      HIGH DEMAND
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-[#555]">Average Wait Time</p>
                      <p className="text-[#ededed] font-bold">20-26 weeks</p>
                    </div>
                    <div>
                      <p className="text-[#555]">Closest Major City</p>
                      <p className="text-[#ededed]">Detroit, MI (in city)</p>
                    </div>
                  </div>
                  <p className="text-[#888] mb-3">
                    <strong className="text-[#ededed]">Why it's crowded:</strong> Major metro area with heavy cross-border traffic to Windsor, Ontario.
                  </p>
                  <p className="text-[#888]">
                    <strong className="text-[#ededed]">Best for:</strong> Southeast Michigan residents. High demand means slots fill fast—automation helps.
                  </p>
                </div>

                {/* #8 Niagara Falls */}
                <div className="bg-[#111] border border-[#222] rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-[#ededed]">8. Niagara Falls, New York</h3>
                      <p className="text-sm text-[#555]">US Port of Entry</p>
                    </div>
                    <span className="px-3 py-1 bg-[#ef4444]/20 text-[#ef4444] text-xs font-bold rounded-full">
                      VERY HIGH DEMAND
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-[#555]">Average Wait Time</p>
                      <p className="text-[#ededed] font-bold">24-30 weeks</p>
                    </div>
                    <div>
                      <p className="text-[#555]">Closest Major City</p>
                      <p className="text-[#ededed]">Buffalo, NY (20 min)</p>
                    </div>
                  </div>
                  <p className="text-[#888] mb-3">
                    <strong className="text-[#ededed]">Why it's packed:</strong> Tourist destination plus major border crossing. Extremely high demand.
                  </p>
                  <p className="text-[#888]">
                    <strong className="text-[#ededed]">Better alternative:</strong> Try Fort Erie (30 min away) for 2x faster appointments.
                  </p>
                </div>

                {/* Airport Locations (grouped) */}
                <div className="bg-[#111] border border-[#3b82f6] rounded-lg p-6">
                  <h3 className="text-2xl font-bold mb-4 text-[#ededed]">Airport Enrollment Centers (Variable Wait Times)</h3>
                  <p className="text-[#888] mb-6">
                    These centers operate inside international airports. Wait times fluctuate based on enrollment on arrival (EOA) availability.
                  </p>

                  <div className="space-y-4">
                    <div className="border-l-4 border-[#3b82f6] pl-4">
                      <h4 className="font-bold text-[#ededed]">Vancouver International Airport (YVR)</h4>
                      <p className="text-sm text-[#555] mb-2">Wait Time: 16-22 weeks</p>
                      <p className="text-[#888] text-sm">
                        Popular for BC residents and Pacific Northwest applicants willing to fly to Canada for interview.
                      </p>
                    </div>

                    <div className="border-l-4 border-[#3b82f6] pl-4">
                      <h4 className="font-bold text-[#ededed]">Calgary International Airport (YYC)</h4>
                      <p className="text-sm text-[#555] mb-2">Wait Time: 14-20 weeks</p>
                      <p className="text-[#888] text-sm">
                        Good alternative for Western Canada and northern US travelers.
                      </p>
                    </div>

                    <div className="border-l-4 border-[#3b82f6] pl-4">
                      <h4 className="font-bold text-[#ededed]">Toronto Pearson Airport (YYZ)</h4>
                      <p className="text-sm text-[#555] mb-2">Wait Time: 20-28 weeks</p>
                      <p className="text-[#888] text-sm">
                        Busiest Canadian airport = high demand. Consider smaller centers.
                      </p>
                    </div>

                    <div className="border-l-4 border-[#3b82f6] pl-4">
                      <h4 className="font-bold text-[#ededed]">Montreal-Trudeau Airport (YUL)</h4>
                      <p className="text-sm text-[#555] mb-2">Wait Time: 18-24 weeks</p>
                      <p className="text-[#888] text-sm">
                        Serves Quebec and northeastern US; moderate-high demand.
                      </p>
                    </div>

                    <div className="border-l-4 border-[#3b82f6] pl-4">
                      <h4 className="font-bold text-[#ededed]">Winnipeg International Airport (YWG)</h4>
                      <p className="text-sm text-[#555] mb-2">Wait Time: 12-18 weeks</p>
                      <p className="text-[#888] text-sm">
                        Lower demand than major hubs; good for prairie region applicants.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-[#ededed]">
                Choosing the Right Location: Strategy Guide
              </h2>

              <div className="bg-[#111] border border-[#222] rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-3 text-[#3b82f6]">If Speed is Your #1 Priority</h3>
                <ol className="list-decimal list-inside text-[#888] space-y-2">
                  <li>Choose the fastest center within driving/flying distance (Calais, Sweetgrass, Fort Erie)</li>
                  <li>
                    Use{' '}
                    <a
                      href="https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID"
                      className="text-[#3b82f6] hover:text-[#2563eb] font-semibold underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      NEXUS Alert
                    </a>{' '}
                    to monitor multiple locations simultaneously
                  </li>
                  <li>Be flexible with dates (weekday appointments open faster)</li>
                  <li>Book the first available slot, then reschedule if needed</li>
                </ol>
              </div>

              <div className="bg-[#111] border border-[#222] rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-3 text-[#ededed]">If Convenience is More Important</h3>
                <ul className="list-disc list-inside text-[#888] space-y-2">
                  <li>Pick the center closest to you (even if wait times are longer)</li>
                  <li>Set up automated monitoring to catch cancellations 24/7</li>
                  <li>Consider airport centers if you travel through those airports regularly</li>
                </ul>
              </div>

              <div className="bg-[#111] border border-[#222] rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3 text-[#ededed]">Regional Recommendations</h3>
                <ul className="list-disc list-inside text-[#888] space-y-3">
                  <li>
                    <strong className="text-[#ededed]">Pacific Northwest (WA, OR):</strong> Sweetgrass, MT (fly to Great Falls) or Blaine, WA with automated monitoring
                  </li>
                  <li>
                    <strong className="text-[#ededed]">New England (MA, NH, VT, ME):</strong> Calais, ME or Champlain, NY
                  </li>
                  <li>
                    <strong className="text-[#ededed]">New York:</strong> Fort Erie, ON (near Buffalo) or Lansdowne, ON (Thousand Islands)
                  </li>
                  <li>
                    <strong className="text-[#ededed]">Midwest (MI, OH, IL):</strong> Detroit, MI or consider flying to Canada (Winnipeg, Toronto)
                  </li>
                  <li>
                    <strong className="text-[#ededed]">Mountain West (MT, ID, WY):</strong> Sweetgrass, MT (fastest in the region)
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">
                Can You Switch Locations After Booking?
              </h2>
              <p className="text-[#888] leading-relaxed mb-4">
                <strong className="text-[#ededed]">Yes!</strong> You can reschedule your NEXUS interview to a different enrollment center at any time with no penalty. Many applicants use this strategy:
              </p>

              <ol className="list-decimal list-inside text-[#888] space-y-3 mb-6">
                <li>Book an appointment at <em>any</em> available center (even if it's far away or months out)</li>
                <li>
                  Keep monitoring your preferred center(s) using{' '}
                  <a
                    href="https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID"
                    className="text-[#3b82f6] hover:text-[#2563eb] font-semibold underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    NEXUS Alert
                  </a>
                </li>
                <li>When a better slot opens at your preferred location, reschedule and cancel the original</li>
              </ol>

              <div className="bg-[#0f1729] border border-[#3b82f6] rounded-lg p-6">
                <p className="text-[#888]">
                  <strong className="text-[#ededed]">Pro Strategy:</strong> Book Calais or Sweetgrass for a "backup" appointment 2-3 months out, then actively hunt for a sooner slot at Blaine, Detroit, or your local center. You have a guaranteed interview date while you optimize.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[#ededed]">Can I interview at a Canadian enrollment center if I'm a US resident?</h3>
                  <p className="text-[#888] leading-relaxed">
                    Yes! NEXUS interviews can be completed at any of the 13 enrollment centers, regardless of your residency. You just need valid documents to enter Canada (passport, visa if applicable).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[#ededed]">Which enrollment center is the absolute fastest?</h3>
                  <p className="text-[#888] leading-relaxed">
                    Calais, Maine and Sweetgrass, Montana consistently have the shortest wait times (6-12 weeks on average) due to their remote locations and lower applicant volume.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[#ededed]">Do airport centers have walk-in interviews?</h3>
                  <p className="text-[#888] leading-relaxed">
                    Some airport centers offer "Enrollment on Arrival" for conditionally approved applicants returning from international trips. However, availability isn't guaranteed—it's better to schedule a proper appointment.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[#ededed]">How do I monitor multiple centers at once?</h3>
                  <p className="text-[#888] leading-relaxed">
                    Use{' '}
                    <a
                      href="https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID"
                      className="text-[#3b82f6] hover:text-[#2563eb] font-semibold underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      NEXUS Alert
                    </a>
                    . You can select up to 10 enrollment centers and get notified instantly when appointments become available at any of them. See our guide on{' '}
                    <Link href="/blog/how-to-get-nexus-appointment-fast" className="text-[#3b82f6] hover:text-[#2563eb] underline">
                      getting NEXUS appointments fast
                    </Link>.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[#ededed]">Are wait times different for first-time applicants vs renewals?</h3>
                  <p className="text-[#888] leading-relaxed">
                    Most renewals don't require an interview (you renew online). If you do need an interview for a renewal, you'll use the same appointment system as first-time applicants.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 rounded-xl border border-[#3b82f6] bg-[#0f1729] text-center">
            <h2 className="text-2xl font-bold mb-3">
              Monitor All 13 Locations Automatically
            </h2>
            <p className="text-[#888] mb-6 max-w-xl mx-auto">
              Stop manually checking each enrollment center. NEXUS Alert monitors all 13 locations 24/7 and sends you instant notifications when appointments open up.
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
                href="/blog/reschedule-nexus-interview"
                className="block p-4 rounded-lg border border-[#222] hover:border-[#3b82f6] transition"
              >
                <h4 className="font-semibold mb-1 text-[#ededed]">
                  Can You Reschedule Your NEXUS Interview?
                </h4>
                <p className="text-sm text-[#888]">
                  Everything you need to know about changing your NEXUS appointment
                </p>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
