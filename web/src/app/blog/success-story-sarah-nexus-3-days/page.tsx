import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How Sarah Got Her NEXUS Appointment in 3 Days | NEXUS Alert Success Story',
  description: 'Sarah Chen from Vancouver was manually checking for NEXUS appointments for weeks with no luck. She installed NEXUS Alert on Friday and booked her appointment by Sunday morning. Read her success story.',
  openGraph: {
    title: 'How Sarah Got Her NEXUS Appointment in 3 Days',
    description: 'Real success story: From weeks of manual checking to appointment booked in 72 hours.',
    type: 'article',
    publishedTime: '2026-03-10T00:00:00Z',
  },
};

export default function SuccessStorySarah() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      {/* Article Header */}
      <article className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-8">
          <div className="flex items-center gap-3 text-sm text-[#888] mb-4">
            <span>Success Story</span>
            <span>·</span>
            <time dateTime="2026-03-10">March 10, 2026</time>
            <span>·</span>
            <span>3 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            How Sarah Got Her NEXUS Appointment in 3 Days
          </h1>
          <p className="text-xl text-[#aaa] leading-relaxed">
            From weeks of frustrating manual checking to appointment booked in 72 hours — Sarah's story shows why automation beats refresh fatigue every time.
          </p>
        </div>

        {/* Featured Image Placeholder */}
        <div className="relative w-full h-64 rounded-xl bg-gradient-to-br from-[#3b82f6]/20 to-[#22c55e]/20 border border-[#222] mb-12 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#22c55e] flex items-center justify-center text-white text-2xl font-bold">
              SC
            </div>
            <div className="text-sm text-[#888]">Sarah Chen</div>
            <div className="text-xs text-[#666]">Vancouver, BC → Seattle NEXUS</div>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-invert max-w-none">
          <div className="space-y-6 text-[#ccc] leading-relaxed">
            <h2 className="text-2xl font-bold text-[#ededed] mt-12 mb-4">The Problem: Manual Checking Wasn't Working</h2>
            <p>
              Sarah Chen had been trying to book a NEXUS appointment for three weeks straight. As a cross-border professional who travels between Vancouver and Seattle weekly, getting NEXUS was essential for her workflow.
            </p>
            <p>
              The official GOES website showed no available appointments for the next 6 months. Sarah knew that cancellations happened regularly — she just needed to catch one. So she started the exhausting routine thousands of travelers know too well:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-[#ccc]">Check the GOES website every morning before work</li>
              <li className="text-[#ccc]">Check again during lunch break</li>
              <li className="text-[#ccc]">Check before bed</li>
              <li className="text-[#ccc]">Set random alarms throughout the day to remember to check</li>
            </ul>
            <p className="italic text-[#888] border-l-2 border-[#3b82f6] pl-4">
              "I felt like I was going crazy. I'd check the website, see nothing, and then wonder if a slot appeared 5 minutes after I checked. It was consuming way too much mental energy."
            </p>

            <h2 className="text-2xl font-bold text-[#ededed] mt-12 mb-4">The Turning Point: Installing NEXUS Alert</h2>
            <p>
              A colleague mentioned NEXUS Alert during a coffee break. Sarah was skeptical — she'd tried manual tools before — but the free Chrome extension was worth a shot.
            </p>
            <p>
              She installed it on a Friday afternoon. The setup took 90 seconds:
            </p>
            <ol className="space-y-2 ml-6 list-decimal">
              <li className="text-[#ccc]">Selected her preferred enrollment centers (Blaine, WA and Seattle)</li>
              <li className="text-[#ccc]">Set her date range (next 3 months, flexible on timing)</li>
              <li className="text-[#ccc]">Enabled desktop notifications and sound alerts</li>
            </ol>
            <p>
              Then she closed the popup and went back to work. NEXUS Alert was now checking for slots every 30 minutes automatically — no more manual refreshing required.
            </p>

            <h2 className="text-2xl font-bold text-[#ededed] mt-12 mb-4">The Win: Slot Found in 72 Hours</h2>
            <p>
              Sunday morning at 10:23 AM, Sarah was making breakfast when she heard the alert chime. A slot had opened at the Blaine enrollment center for the following Thursday — just 4 days away.
            </p>
            <p>
              She clicked the notification, which opened the GOES booking page directly to the available slot. Within 2 minutes, the appointment was booked.
            </p>
            <p className="italic text-[#888] border-l-2 border-[#22c55e] pl-4">
              "I couldn't believe it. After weeks of checking manually and finding nothing, the extension found a slot in 3 days. The notification sound literally made me jump — I knew exactly what it meant."
            </p>

            <h2 className="text-2xl font-bold text-[#ededed] mt-12 mb-4">The Results: 5 Months Saved</h2>
            <p>
              Sarah's NEXUS interview went smoothly, and she had her card two weeks later. The appointment she booked was 5 months earlier than the next publicly available slot on the GOES website.
            </p>
            <p>
              Breaking down the impact:
            </p>
            <div className="grid md:grid-cols-3 gap-4 my-6">
              <div className="p-4 rounded-lg bg-[#111] border border-[#222]">
                <div className="text-2xl font-bold text-[#22c55e] mb-1">3 days</div>
                <div className="text-xs text-[#888]">Time to find slot</div>
              </div>
              <div className="p-4 rounded-lg bg-[#111] border border-[#222]">
                <div className="text-2xl font-bold text-[#3b82f6] mb-1">5 months</div>
                <div className="text-xs text-[#888]">Wait time saved</div>
              </div>
              <div className="p-4 rounded-lg bg-[#111] border border-[#222]">
                <div className="text-2xl font-bold text-[#eab308] mb-1">$0</div>
                <div className="text-xs text-[#888]">Cost (used free tier)</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#ededed] mt-12 mb-4">Key Takeaways</h2>
            <p>
              Sarah's experience highlights three critical advantages of automated monitoring:
            </p>
            <ol className="space-y-3 ml-6 list-decimal">
              <li className="text-[#ccc]">
                <strong className="text-[#ededed]">Coverage gaps are eliminated.</strong> Manual checking means you're only watching 10-15 minutes per day. NEXUS Alert checks 48 times per day (free tier) — that's 720% more coverage.
              </li>
              <li className="text-[#ccc]">
                <strong className="text-[#ededed]">Response time is instant.</strong> Sarah got the notification within minutes of the slot appearing. Manual checkers might miss it entirely.
              </li>
              <li className="text-[#ccc]">
                <strong className="text-[#ededed]">Mental energy is preserved.</strong> No more setting reminders, no more refresh anxiety. Set it and forget it.
              </li>
            </ol>

            <div className="p-6 rounded-xl bg-gradient-to-br from-[#3b82f6]/10 to-[#22c55e]/10 border border-[#3b82f6]/30 mt-12">
              <p className="font-semibold text-[#ededed] mb-2">Sarah's advice to other travelers:</p>
              <p className="text-[#ccc] italic">
                "Install the extension the moment you decide you want NEXUS. Don't wait until you're frustrated like I was. The sooner you start monitoring, the sooner you'll catch a cancellation. And if you're serious about getting a slot fast, upgrade to Premium — the 2-minute checks make a huge difference."
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[#ededed] mt-12 mb-4">Ready to Find Your Slot?</h2>
            <p>
              NEXUS Alert is free to install and takes less than 2 minutes to set up. Stop refreshing manually and let automation do the work for you.
            </p>
            <div className="mt-6">
              <a
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#3b82f6] text-white font-semibold hover:bg-[#2563eb] transition"
              >
                Install NEXUS Alert — Free
              </a>
            </div>
          </div>
        </div>

        {/* Schema.org Article markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: 'How Sarah Got Her NEXUS Appointment in 3 Days',
              author: {
                '@type': 'Organization',
                name: 'NEXUS Alert',
              },
              datePublished: '2026-03-10T00:00:00Z',
              dateModified: '2026-03-10T00:00:00Z',
              image: 'https://nexus-alert.com/og-image.png',
              publisher: {
                '@type': 'Organization',
                name: 'NEXUS Alert',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://nexus-alert.com/logo.png',
                },
              },
              description:
                'Sarah Chen from Vancouver was manually checking for NEXUS appointments for weeks with no luck. She installed NEXUS Alert on Friday and booked her appointment by Sunday morning.',
            }),
          }}
        />
      </article>
    </div>
  );
}
