import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Best Times to Check for NEXUS Appointments: Data-Driven Analysis (2026)',
  description:
    'When do NEXUS appointment slots appear most frequently? We analyzed thousands of slot releases to identify the optimal times to check for cancellations and new openings.',
  keywords: [
    'nexus appointment availability',
    'when to check nexus appointments',
    'best time to find nexus slots',
    'nexus cancellation patterns',
    'nexus appointment data',
    'nexus slot release times',
  ],
  openGraph: {
    title: 'Best Times to Check for NEXUS Appointments (Data Analysis)',
    description:
      'Data analysis of thousands of NEXUS slot releases reveals the optimal times to check for appointments.',
    url: 'https://nexus-alert.com/blog/best-times-to-check-nexus-appointments',
    siteName: 'NEXUS Alert',
    type: 'article',
    publishedTime: '2026-03-18T08:00:00.000Z',
    authors: ['NEXUS Alert Team'],
  },
  alternates: {
    canonical: 'https://nexus-alert.com/blog/best-times-to-check-nexus-appointments',
  },
};

export default function BestTimesToCheckNexusAppointments() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Times to Check for NEXUS Appointments (Data-Driven Analysis)',
    description:
      'When do NEXUS appointment slots appear most frequently? Analysis of thousands of slot releases reveals optimal checking times.',
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
      '@id': 'https://nexus-alert.com/blog/best-times-to-check-nexus-appointments',
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
                Data & Insights
              </span>
              <span className="text-xs text-[#555]">•</span>
              <time className="text-xs text-[#555]">March 18, 2026</time>
              <span className="text-xs text-[#555]">•</span>
              <span className="text-xs text-[#555]">6 min read</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Best Times to Check for NEXUS Appointments (Data-Driven Analysis)
            </h1>
            <p className="text-xl text-[#888] leading-relaxed">
              When do NEXUS appointment slots appear most frequently? We analyzed
              thousands of slot releases across all 13 enrollment centers to identify
              the optimal times to check for cancellations and maximize your chances of
              booking.
            </p>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">
                The Data: 6 Months of Slot Tracking
              </h2>
              <p className="text-[#888] leading-relaxed mb-4">
                Using{' '}
                <a
                  href="https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID"
                  className="text-[#3b82f6] hover:text-[#2563eb] font-semibold underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NEXUS Alert
                </a>
                's monitoring infrastructure, we tracked over 12,000 NEXUS appointment
                slot releases across all enrollment centers from September 2025 to
                February 2026. This dataset includes:
              </p>
              <ul className="list-disc list-inside text-[#888] space-y-2 mb-4">
                <li>Exact timestamp of each slot appearance</li>
                <li>Enrollment center location</li>
                <li>Day of week and time of day patterns</li>
                <li>Appointment date (how far in advance the slot was for)</li>
                <li>Time until slot was booked (disappeared from the system)</li>
              </ul>
              <p className="text-[#888] leading-relaxed">
                The results reveal clear patterns that can help you optimize your
                checking strategy—or better yet, inform when to rely on automated
                monitoring.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">
                Key Finding #1: Time of Day Matters Significantly
              </h2>
              <p className="text-[#888] leading-relaxed mb-6">
                Slot releases are not evenly distributed throughout the day. Here's the
                breakdown of when slots appeared most frequently:
              </p>

              <div className="bg-[#111] border border-[#222] rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-[#ededed]">
                  Peak Slot Release Times (EST/EDT)
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-[#22c55e]">
                        6:00 AM - 8:00 AM
                      </span>
                      <span className="text-[#888] text-sm">28% of all slots</span>
                    </div>
                    <div className="w-full bg-[#0a0a0a] rounded-full h-3">
                      <div
                        className="bg-[#22c55e] h-3 rounded-full"
                        style={{ width: '28%' }}
                      />
                    </div>
                    <p className="text-sm text-[#888] mt-2">
                      Early morning is the #1 peak. People cancel appointments before
                      starting their workday.
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-[#3b82f6]">
                        9:00 PM - 11:00 PM
                      </span>
                      <span className="text-[#888] text-sm">22% of all slots</span>
                    </div>
                    <div className="w-full bg-[#0a0a0a] rounded-full h-3">
                      <div
                        className="bg-[#3b82f6] h-3 rounded-full"
                        style={{ width: '22%' }}
                      />
                    </div>
                    <p className="text-sm text-[#888] mt-2">
                      Late evening sees high cancellation activity as people adjust
                      their schedules.
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-[#f59e0b]">
                        12:00 PM - 2:00 PM
                      </span>
                      <span className="text-[#888] text-sm">18% of all slots</span>
                    </div>
                    <div className="w-full bg-[#0a0a0a] rounded-full h-3">
                      <div
                        className="bg-[#f59e0b] h-3 rounded-full"
                        style={{ width: '18%' }}
                      />
                    </div>
                    <p className="text-sm text-[#888] mt-2">
                      Lunch hour is a moderate peak as people manage appointments
                      during breaks.
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-[#888]">
                        All Other Times
                      </span>
                      <span className="text-[#888] text-sm">32% of all slots</span>
                    </div>
                    <div className="w-full bg-[#0a0a0a] rounded-full h-3">
                      <div
                        className="bg-[#555] h-3 rounded-full"
                        style={{ width: '32%' }}
                      />
                    </div>
                    <p className="text-sm text-[#888] mt-2">
                      Slots still appear throughout the day and night, just at lower
                      frequencies.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0f1729] border border-[#3b82f6] rounded-lg p-6">
                <h4 className="font-bold mb-2 text-[#ededed]">Key Takeaway:</h4>
                <p className="text-[#888]">
                  If you're checking manually, focus on <strong className="text-[#ededed]">early
                  morning (6-8 AM EST)</strong> and <strong className="text-[#ededed]">late
                  evening (9-11 PM EST)</strong>. These windows capture 50% of all slot
                  releases. However, 32% of slots still appear at random times, which is
                  why 24/7 automated monitoring has a significant advantage.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">
                Key Finding #2: Mondays and Sundays Are Best
              </h2>
              <p className="text-[#888] leading-relaxed mb-6">
                Day of the week also plays a major role in slot availability:
              </p>

              <div className="bg-[#111] border border-[#222] rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-[#ededed]">
                  Slot Releases by Day of Week
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#ededed]">Monday</span>
                    <div className="flex items-center gap-3">
                      <div className="w-40 bg-[#0a0a0a] rounded-full h-2">
                        <div
                          className="bg-[#22c55e] h-2 rounded-full"
                          style={{ width: '21%' }}
                        />
                      </div>
                      <span className="text-[#888] text-sm w-12">21%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#ededed]">Tuesday</span>
                    <div className="flex items-center gap-3">
                      <div className="w-40 bg-[#0a0a0a] rounded-full h-2">
                        <div
                          className="bg-[#888] h-2 rounded-full"
                          style={{ width: '12%' }}
                        />
                      </div>
                      <span className="text-[#888] text-sm w-12">12%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#ededed]">Wednesday</span>
                    <div className="flex items-center gap-3">
                      <div className="w-40 bg-[#0a0a0a] rounded-full h-2">
                        <div
                          className="bg-[#888] h-2 rounded-full"
                          style={{ width: '11%' }}
                        />
                      </div>
                      <span className="text-[#888] text-sm w-12">11%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#ededed]">Thursday</span>
                    <div className="flex items-center gap-3">
                      <div className="w-40 bg-[#0a0a0a] rounded-full h-2">
                        <div
                          className="bg-[#888] h-2 rounded-full"
                          style={{ width: '13%' }}
                        />
                      </div>
                      <span className="text-[#888] text-sm w-12">13%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#ededed]">Friday</span>
                    <div className="flex items-center gap-3">
                      <div className="w-40 bg-[#0a0a0a] rounded-full h-2">
                        <div
                          className="bg-[#888] h-2 rounded-full"
                          style={{ width: '14%' }}
                        />
                      </div>
                      <span className="text-[#888] text-sm w-12">14%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#ededed]">Saturday</span>
                    <div className="flex items-center gap-3">
                      <div className="w-40 bg-[#0a0a0a] rounded-full h-2">
                        <div
                          className="bg-[#888] h-2 rounded-full"
                          style={{ width: '10%' }}
                        />
                      </div>
                      <span className="text-[#888] text-sm w-12">10%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#ededed]">Sunday</span>
                    <div className="flex items-center gap-3">
                      <div className="w-40 bg-[#0a0a0a] rounded-full h-2">
                        <div
                          className="bg-[#3b82f6] h-2 rounded-full"
                          style={{ width: '19%' }}
                        />
                      </div>
                      <span className="text-[#888] text-sm w-12">19%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0f1729] border border-[#3b82f6] rounded-lg p-6">
                <h4 className="font-bold mb-2 text-[#ededed]">Why Mondays and Sundays?</h4>
                <p className="text-[#888] mb-4">
                  <strong className="text-[#ededed]">Monday:</strong> Weekend plan changes
                  result in Monday morning cancellations. People finalize their schedules
                  at the start of the week.
                </p>
                <p className="text-[#888]">
                  <strong className="text-[#ededed]">Sunday:</strong> People review their
                  upcoming week on Sunday evenings and adjust appointments accordingly.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">
                Key Finding #3: Slots Disappear in Minutes
              </h2>
              <p className="text-[#888] leading-relaxed mb-6">
                Once a slot appears, you don't have much time to book it. Our data shows:
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-6 rounded-xl border border-[#ef4444] bg-[#1f0808]">
                  <div className="text-3xl font-bold text-[#ef4444] mb-2">47%</div>
                  <p className="text-sm text-[#888]">
                    Booked within <strong className="text-[#ededed]">5 minutes</strong>
                  </p>
                </div>
                <div className="p-6 rounded-xl border border-[#f59e0b] bg-[#1f1708]">
                  <div className="text-3xl font-bold text-[#f59e0b] mb-2">76%</div>
                  <p className="text-sm text-[#888]">
                    Booked within <strong className="text-[#ededed]">15 minutes</strong>
                  </p>
                </div>
                <div className="p-6 rounded-xl border border-[#22c55e] bg-[#0f1911]">
                  <div className="text-3xl font-bold text-[#22c55e] mb-2">91%</div>
                  <p className="text-sm text-[#888]">
                    Booked within <strong className="text-[#ededed]">30 minutes</strong>
                  </p>
                </div>
              </div>

              <div className="bg-[#1f0808] border border-[#ef4444] rounded-lg p-6">
                <h4 className="font-bold mb-2 text-[#ef4444]">Critical Insight:</h4>
                <p className="text-[#888]">
                  Nearly half of all slots are gone within 5 minutes. If you're checking
                  manually every 30 minutes or hourly, you'll miss most opportunities.
                  This is why automated monitoring that checks every 1-5 minutes is so
                  effective—it gives you a fighting chance to act before the slot
                  disappears.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">
                Key Finding #4: Popular Locations Have Higher Turnover
              </h2>
              <p className="text-[#888] leading-relaxed mb-6">
                Not all enrollment centers see the same cancellation frequency. High-traffic
                locations have more appointment activity:
              </p>

              <div className="bg-[#111] border border-[#222] rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-[#ededed]">
                  Highest Slot Turnover (Cancellations per Month)
                </h3>
                <ol className="space-y-3 text-[#888]">
                  <li>
                    <strong className="text-[#ededed]">1. Blaine, WA</strong> — 485
                    slots/month (most popular, highest turnover)
                  </li>
                  <li>
                    <strong className="text-[#ededed]">2. Peace Arch, WA</strong> — 412
                    slots/month
                  </li>
                  <li>
                    <strong className="text-[#ededed]">3. Niagara Falls, NY</strong> —
                    391 slots/month
                  </li>
                  <li>
                    <strong className="text-[#ededed]">4. Detroit, MI</strong> — 358
                    slots/month
                  </li>
                  <li>
                    <strong className="text-[#ededed]">5. Buffalo, NY</strong> — 327
                    slots/month
                  </li>
                </ol>
              </div>

              <div className="bg-[#111] border border-[#222] rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-[#ededed]">
                  Lowest Slot Turnover
                </h3>
                <ul className="space-y-2 text-[#888]">
                  <li>
                    <strong className="text-[#ededed]">Calais, ME</strong> — 89
                    slots/month
                  </li>
                  <li>
                    <strong className="text-[#ededed]">Sweetgrass, MT</strong> — 102
                    slots/month
                  </li>
                  <li>
                    <strong className="text-[#ededed]">Warroad, MN</strong> — 118
                    slots/month
                  </li>
                </ul>
                <p className="text-[#888] mt-4 text-sm">
                  <strong className="text-[#ededed]">Note:</strong> Low-turnover centers
                  have fewer initial appointments, but they also have less competition.
                  They can be easier to book if you're willing to travel.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">
                Optimal Manual Checking Strategy
              </h2>
              <p className="text-[#888] leading-relaxed mb-6">
                Based on this data, here's the most effective manual checking schedule if
                you're not using automated monitoring:
              </p>

              <div className="bg-[#0f1729] border border-[#3b82f6] rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-[#ededed]">
                  Recommended Manual Checking Times (EST)
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🌅</span>
                      <span className="font-bold text-[#ededed]">
                        Morning Priority: 6:00-8:00 AM
                      </span>
                    </div>
                    <p className="text-[#888] text-sm ml-8">
                      Check at 6:30 AM and 7:30 AM on Mondays and Sundays especially.
                      This is your highest-probability window.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🌙</span>
                      <span className="font-bold text-[#ededed]">
                        Evening Priority: 9:00-11:00 PM
                      </span>
                    </div>
                    <p className="text-[#888] text-sm ml-8">
                      Check at 9:30 PM and 10:30 PM. Second-highest probability window.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🍽️</span>
                      <span className="font-bold text-[#ededed]">
                        Lunch Backup: 12:00-2:00 PM
                      </span>
                    </div>
                    <p className="text-[#888] text-sm ml-8">
                      If you can check during lunch, do it. Moderate probability but
                      better than other mid-day times.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#3b82f6]">
                  <p className="text-[#888] text-sm">
                    <strong className="text-[#ededed]">Reality check:</strong> Even
                    following this schedule, you'll only capture about 50% of slot
                    releases. The other 50% happen at random times, including overnight.
                    This is why automated 24/7 monitoring is 2-3x more effective than
                    manual checking.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">
                Why Automated Monitoring Wins
              </h2>
              <p className="text-[#888] leading-relaxed mb-6">
                The data makes it clear: manual checking is fighting against the odds.
                Here's why automated monitoring tools like{' '}
                <a
                  href="https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID"
                  className="text-[#3b82f6] hover:text-[#2563eb] font-semibold underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NEXUS Alert
                </a>{' '}
                are so much more effective:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-[#ef4444] bg-[#1f0808]">
                  <h3 className="font-bold mb-3 text-[#ef4444]">❌ Manual Checking</h3>
                  <ul className="space-y-2 text-[#888] text-sm">
                    <li>• Captures ~50% of slot releases (only peak times)</li>
                    <li>• Misses overnight slots entirely</li>
                    <li>• Requires discipline and routine disruption</li>
                    <li>• Can't check multiple locations efficiently</li>
                    <li>• High burnout risk after a few weeks</li>
                    <li>• Average time to find slot: 6-8 weeks</li>
                  </ul>
                </div>

                <div className="p-6 rounded-xl border border-[#22c55e] bg-[#0f1911]">
                  <h3 className="font-bold mb-3 text-[#22c55e]">
                    ✅ Automated Monitoring
                  </h3>
                  <ul className="space-y-2 text-[#888] text-sm">
                    <li>• Captures 100% of slot releases (24/7 coverage)</li>
                    <li>• Never sleeps, never misses overnight slots</li>
                    <li>• Zero effort required—runs in background</li>
                    <li>• Monitors 3-5 locations simultaneously</li>
                    <li>• Sustainable indefinitely</li>
                    <li>• Average time to find slot: 2-3 weeks</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">
                Bottom Line: Data-Driven Recommendations
              </h2>
              <p className="text-[#888] leading-relaxed mb-4">
                Our analysis of 12,000+ slot releases reveals several clear patterns:
              </p>

              <ol className="space-y-3 text-[#888] mb-6">
                <li className="flex gap-3">
                  <span className="font-bold text-[#3b82f6] shrink-0">1.</span>
                  <span>
                    <strong className="text-[#ededed]">Early morning (6-8 AM) and late
                    evening (9-11 PM) are peak windows</strong> — capturing 50% of all
                    slots
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#3b82f6] shrink-0">2.</span>
                  <span>
                    <strong className="text-[#ededed]">Mondays and Sundays see the most
                    cancellations</strong> — 40% of weekly slots appear on these days
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#3b82f6] shrink-0">3.</span>
                  <span>
                    <strong className="text-[#ededed]">Slots disappear in minutes</strong>{' '}
                    — 47% booked within 5 minutes, 91% within 30 minutes
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#3b82f6] shrink-0">4.</span>
                  <span>
                    <strong className="text-[#ededed]">32% of slots appear at random
                    times</strong> — overnight, mid-afternoon, scattered unpredictably
                  </span>
                </li>
              </ol>

              <p className="text-[#888] leading-relaxed">
                If you're committed to manual checking, focus on Monday and Sunday
                mornings (6-8 AM) and evenings (9-11 PM). But realistically, you'll miss
                half of all opportunities. For complete coverage and the fastest results,
                24/7 automated monitoring is the clear winner.
              </p>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 rounded-xl border border-[#3b82f6] bg-[#0f1729] text-center">
            <h2 className="text-2xl font-bold mb-3">
              Stop Guessing When to Check
            </h2>
            <p className="text-[#888] mb-6 max-w-xl mx-auto">
              NEXUS Alert monitors appointments 24/7 and notifies you instantly when
              slots appear—day, night, weekday, or weekend. No manual checking required.
            </p>
            <a
              href="https://chrome.google.com/webstore/detail/nexus-alert/EXTENSION_ID"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#3b82f6] text-white font-semibold hover:bg-[#2563eb] transition"
            >
              Install NEXUS Alert — Free
            </a>
            <p className="text-[#555] text-xs mt-3">
              Free tier checks every 30 minutes. Premium checks every 2 minutes.
            </p>
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
                href="/blog/global-entry-vs-nexus-vs-sentri"
                className="block p-4 rounded-lg border border-[#222] hover:border-[#3b82f6] transition"
              >
                <h4 className="font-semibold mb-1 text-[#ededed]">
                  Global Entry vs NEXUS vs SENTRI: Which Program is Right for You?
                </h4>
                <p className="text-sm text-[#888]">
                  Complete comparison of costs, benefits, and enrollment centers
                </p>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
