import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'NEXUS Interview Tips: Everything You Need to Know to Pass (2026 Guide)',
  description:
    'Ace your NEXUS interview on the first try. Complete guide covering required documents, interview questions, what to expect, common mistakes to avoid, and insider tips from successful applicants.',
  keywords: [
    'nexus interview tips',
    'nexus interview questions',
    'nexus interview what to bring',
    'nexus interview preparation',
    'nexus interview process',
    'nexus interview requirements',
    'pass nexus interview',
    'nexus interview checklist',
  ],
  openGraph: {
    title: 'NEXUS Interview Tips: Complete 2026 Guide to Passing',
    description:
      'Everything you need to pass your NEXUS interview on the first try. Required documents, common questions, and insider tips.',
    url: 'https://nexus-alert.com/blog/nexus-interview-tips',
    siteName: 'NEXUS Alert',
    type: 'article',
    publishedTime: '2026-03-18T08:00:00.000Z',
    authors: ['NEXUS Alert Team'],
  },
  alternates: {
    canonical: 'https://nexus-alert.com/blog/nexus-interview-tips',
  },
};

export default function NexusInterviewTips() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'NEXUS Interview Tips: Everything You Need to Know to Pass (2026)',
    description:
      'Ace your NEXUS interview on the first try. Complete guide covering required documents, interview questions, what to expect, and common mistakes to avoid.',
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
      '@id': 'https://nexus-alert.com/blog/nexus-interview-tips',
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
                Guides
              </span>
              <span className="text-xs text-[#555]">•</span>
              <time className="text-xs text-[#555]">March 18, 2026</time>
              <span className="text-xs text-[#555]">•</span>
              <span className="text-xs text-[#555]">9 min read</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              NEXUS Interview Tips: Everything You Need to Know to Pass
            </h1>
            <p className="text-xl text-[#888] leading-relaxed">
              Your NEXUS interview is the final step before getting approved for 5 years
              of expedited travel. This complete guide covers exactly what to bring, what
              questions to expect, how to prepare, and the common mistakes that lead to
              denials. With proper preparation, you'll pass on the first try.
            </p>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">
                What to Expect at Your NEXUS Interview
              </h2>
              <p className="text-[#888] leading-relaxed mb-4">
                The NEXUS interview is a joint interview with both US Customs and Border
                Protection (CBP) and Canada Border Services Agency (CBSA) officers. It
                typically lasts 15-30 minutes and takes place at one of 13 NEXUS
                enrollment centers along the US-Canada border.
              </p>
              <div className="bg-[#111] border border-[#222] rounded-lg p-6 mb-4">
                <h4 className="font-bold mb-2 text-[#ededed]">Interview Format:</h4>
                <ul className="list-disc list-inside text-[#888] space-y-1">
                  <li>You'll be interviewed by both US and Canadian officers</li>
                  <li>Interviews are usually conducted back-to-back (not simultaneous)</li>
                  <li>Each officer takes about 10-15 minutes</li>
                  <li>Officers verify your documents and ask background questions</li>
                  <li>
                    Fingerprints and photo are taken for the NEXUS card (if not already
                    done)
                  </li>
                </ul>
              </div>
              <p className="text-[#888] leading-relaxed">
                The interview is straightforward if you're honest, prepared, and bring the
                correct documents. Most applicants pass on the first try. The approval
                rate is approximately 85-90% for applicants who arrive prepared.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">
                Required Documents Checklist
              </h2>
              <p className="text-[#888] leading-relaxed mb-6">
                Bring <strong className="text-[#ededed]">original documents only</strong>.
                Photocopies are NOT accepted. Missing any required document will result in
                rescheduling your interview.
              </p>

              <div className="bg-[#0f1729] border border-[#3b82f6] rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-[#3b82f6]">
                  Essential Documents (Everyone)
                </h3>
                <ul className="space-y-3 text-[#888]">
                  <li className="flex items-start">
                    <span className="text-[#3b82f6] mr-2 mt-1">✓</span>
                    <div>
                      <strong className="text-[#ededed]">Valid Passport:</strong> Must be
                      valid for at least 6 months beyond your interview date
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3b82f6] mr-2 mt-1">✓</span>
                    <div>
                      <strong className="text-[#ededed]">Proof of Citizenship:</strong>{' '}
                      Birth certificate, naturalization certificate, or citizenship card
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3b82f6] mr-2 mt-1">✓</span>
                    <div>
                      <strong className="text-[#ededed]">Government-Issued ID:</strong>{' '}
                      Driver's license or state ID (in addition to passport)
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3b82f6] mr-2 mt-1">✓</span>
                    <div>
                      <strong className="text-[#ededed]">Proof of Residency:</strong> Recent
                      utility bill, lease agreement, or mortgage statement showing your
                      current address
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3b82f6] mr-2 mt-1">✓</span>
                    <div>
                      <strong className="text-[#ededed]">
                        GOES Conditional Approval Letter:
                      </strong>{' '}
                      Print this from your GOES account or bring it on your phone
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-[#111] border border-[#222] rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-[#ededed]">
                  Additional Documents (If Applicable)
                </h3>
                <ul className="space-y-3 text-[#888]">
                  <li className="flex items-start">
                    <span className="text-[#555] mr-2 mt-1">•</span>
                    <div>
                      <strong className="text-[#ededed]">Green Card Holders:</strong> Bring
                      your Permanent Resident Card (Green Card)
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#555] mr-2 mt-1">•</span>
                    <div>
                      <strong className="text-[#ededed]">
                        Canadian Permanent Residents:
                      </strong>{' '}
                      Bring your PR card or Confirmation of Permanent Residence
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#555] mr-2 mt-1">•</span>
                    <div>
                      <strong className="text-[#ededed]">
                        Name Change Documents:
                      </strong>{' '}
                      Marriage certificate, divorce decree, or legal name change documents
                      if your current name differs from birth certificate
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#555] mr-2 mt-1">•</span>
                    <div>
                      <strong className="text-[#ededed]">
                        Vehicle Registration (optional):
                      </strong>{' '}
                      If you plan to use NEXUS lanes with a vehicle, bring registration and
                      proof of insurance
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#555] mr-2 mt-1">•</span>
                    <div>
                      <strong className="text-[#ededed]">Minors (under 18):</strong> Birth
                      certificate, custody documents if applicable, and consent letter from
                      non-accompanying parent
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-[#1f1708] border border-[#f59e0b] rounded-lg p-6">
                <p className="text-[#888]">
                  <strong className="text-[#f59e0b]">⚠️ Pro Tip:</strong> Create a
                  checklist and verify you have every document the night before your
                  interview. Place all documents in a folder so you can easily hand them
                  over. Missing even one document means rescheduling (which can take
                  months).
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">
                Common NEXUS Interview Questions
              </h2>
              <p className="text-[#888] leading-relaxed mb-6">
                The questions are straightforward and designed to verify your identity,
                background, and eligibility. Answer honestly and directly. Here are the
                most common questions asked:
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3 text-[#3b82f6]">
                    Personal Background
                  </h3>
                  <ul className="list-disc list-inside text-[#888] space-y-2">
                    <li>What is your current occupation?</li>
                    <li>Where do you work? What does your company do?</li>
                    <li>Have you ever been arrested or convicted of a crime?</li>
                    <li>
                      Have you ever been denied entry to the US or Canada? If yes, why?
                    </li>
                    <li>Do you have any pending legal issues or court cases?</li>
                    <li>
                      Have you ever overstayed a visa or violated immigration laws in any
                      country?
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-[#3b82f6]">
                    Travel History & Plans
                  </h3>
                  <ul className="list-disc list-inside text-[#888] space-y-2">
                    <li>Why are you applying for NEXUS?</li>
                    <li>How often do you cross the US-Canada border?</li>
                    <li>What is the purpose of your border crossings? (work, leisure, etc.)</li>
                    <li>Which countries have you visited in the past 5 years?</li>
                    <li>Do you have family or friends in Canada? Where?</li>
                    <li>Do you own property in Canada or the US?</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-[#3b82f6]">
                    Customs & Import Questions
                  </h3>
                  <ul className="list-disc list-inside text-[#888] space-y-2">
                    <li>Have you ever been stopped by customs? If yes, why?</li>
                    <li>
                      Have you ever failed to declare goods when crossing a border?
                    </li>
                    <li>What do you typically bring across the border?</li>
                    <li>
                      Are you aware of the customs declaration requirements for both
                      countries?
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-[#3b82f6]">
                    Verification Questions
                  </h3>
                  <ul className="list-disc list-inside text-[#888] space-y-2">
                    <li>Confirm your current address</li>
                    <li>Confirm your employment details</li>
                    <li>
                      Verify information from your application (they'll reference specific
                      details)
                    </li>
                    <li>Explain any gaps in employment or unusual travel patterns</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 bg-[#0f1729] border border-[#3b82f6] rounded-lg p-6">
                <h4 className="font-bold mb-2 text-[#ededed]">
                  How to Answer Effectively:
                </h4>
                <ul className="list-disc list-inside text-[#888] space-y-2">
                  <li>
                    <strong className="text-[#ededed]">Be honest.</strong> Officers can
                    access your full travel and legal history. Lying or omitting information
                    will result in immediate denial.
                  </li>
                  <li>
                    <strong className="text-[#ededed]">Keep answers concise.</strong> Don't
                    over-explain or volunteer unnecessary information.
                  </li>
                  <li>
                    <strong className="text-[#ededed]">
                      If you don't understand a question, ask for clarification.
                    </strong>{' '}
                    It's better to ask than to answer incorrectly.
                  </li>
                  <li>
                    <strong className="text-[#ededed]">Stay calm and professional.</strong>{' '}
                    Officers are evaluating your demeanor and trustworthiness.
                  </li>
                  <li>
                    <strong className="text-[#ededed]">
                      Admit past mistakes if asked.
                    </strong>{' '}
                    A minor infraction years ago (if disclosed in your application) won't
                    necessarily disqualify you. Lying about it will.
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">
                Day-of-Interview Preparation
              </h2>
              <p className="text-[#888] leading-relaxed mb-6">
                How you present yourself matters. Here's how to make the best impression:
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-[#111] border border-[#222] rounded-lg">
                  <h4 className="font-bold mb-2 text-[#ededed]">
                    ✅ Arrive 15-30 Minutes Early
                  </h4>
                  <p className="text-[#888] text-sm">
                    NEXUS enrollment centers are often in or near border crossings. Traffic
                    can be unpredictable. Arriving late may result in missing your
                    appointment and having to reschedule.
                  </p>
                </div>

                <div className="p-4 bg-[#111] border border-[#222] rounded-lg">
                  <h4 className="font-bold mb-2 text-[#ededed]">
                    ✅ Dress Professionally
                  </h4>
                  <p className="text-[#888] text-sm">
                    You don't need a suit, but dress neatly (business casual). First
                    impressions matter, and officers are evaluating your overall
                    presentation.
                  </p>
                </div>

                <div className="p-4 bg-[#111] border border-[#222] rounded-lg">
                  <h4 className="font-bold mb-2 text-[#ededed]">
                    ✅ Bring All Documents in a Folder
                  </h4>
                  <p className="text-[#888] text-sm">
                    Organize your documents in the order listed above. Being organized
                    signals that you're prepared and take the process seriously.
                  </p>
                </div>

                <div className="p-4 bg-[#111] border border-[#222] rounded-lg">
                  <h4 className="font-bold mb-2 text-[#ededed]">
                    ✅ Review Your Application
                  </h4>
                  <p className="text-[#888] text-sm">
                    Print and review your GOES application the night before. Officers will
                    reference details from your application, and you need to remember what
                    you wrote (especially employment history and travel dates).
                  </p>
                </div>

                <div className="p-4 bg-[#111] border border-[#222] rounded-lg">
                  <h4 className="font-bold mb-2 text-[#ededed]">
                    ✅ Turn Off Your Phone
                  </h4>
                  <p className="text-[#888] text-sm">
                    No phones, cameras, or electronic devices are allowed in the interview
                    area. Turn your phone off (not just silent) before entering.
                  </p>
                </div>

                <div className="p-4 bg-[#111] border border-[#222] rounded-lg">
                  <h4 className="font-bold mb-2 text-[#ededed]">
                    ✅ Leave Weapons and Prohibited Items in Your Car
                  </h4>
                  <p className="text-[#888] text-sm">
                    Enrollment centers have strict security. Don't bring knives, pepper
                    spray, or anything that could be considered a weapon. You'll go through
                    a security screening.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">
                Common Mistakes That Lead to Denial
              </h2>
              <p className="text-[#888] leading-relaxed mb-6">
                Most denials are preventable. Avoid these critical mistakes:
              </p>

              <ul className="space-y-4">
                <li className="text-[#888]">
                  <strong className="text-[#ededed]">
                    ❌ Lying or omitting information on your application:
                  </strong>{' '}
                  Officers have access to your full criminal, travel, and customs history
                  across multiple databases. If you lied on your application (even about
                  something minor), it will be discovered and result in immediate denial.
                </li>
                <li className="text-[#888]">
                  <strong className="text-[#ededed]">
                    ❌ Arriving without required documents:
                  </strong>{' '}
                  Missing your birth certificate, passport, or proof of residency means
                  instant rescheduling. This can set you back months.
                </li>
                <li className="text-[#888]">
                  <strong className="text-[#ededed]">
                    ❌ Being evasive or defensive:
                  </strong>{' '}
                  If an officer asks a follow-up question, they're not accusing you of
                  anything—they're verifying information. Stay calm and answer directly.
                </li>
                <li className="text-[#888]">
                  <strong className="text-[#ededed]">
                    ❌ Inconsistent answers between US and Canadian officers:
                  </strong>{' '}
                  You'll be asked similar questions by both officers. Make sure your
                  answers are consistent. Contradictions raise red flags.
                </li>
                <li className="text-[#888]">
                  <strong className="text-[#ededed]">
                    ❌ Past customs violations or undeclared goods:
                  </strong>{' '}
                  If you've been caught bringing undeclared goods across the border
                  (alcohol, tobacco, goods over the duty-free limit), this can disqualify
                  you. Be prepared to explain any past incidents.
                </li>
                <li className="text-[#888]">
                  <strong className="text-[#ededed]">
                    ❌ DUI or criminal convictions not disclosed:
                  </strong>{' '}
                  A DUI, even from years ago, can disqualify you from NEXUS—especially if
                  you didn't disclose it on your application. If you have a criminal
                  record, consult with an immigration attorney before applying.
                </li>
                <li className="text-[#888]">
                  <strong className="text-[#ededed]">
                    ❌ Bringing a friend or family member into the interview:
                  </strong>{' '}
                  Only the applicant is allowed in the interview room (exception: parents
                  of minors). Don't bring anyone with you unless they're also interviewing.
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">
                What Happens After the Interview?
              </h2>
              <p className="text-[#888] leading-relaxed mb-4">
                In most cases, you'll receive a decision <strong className="text-[#ededed]">
                immediately</strong> at the end of your interview.
              </p>
              <div className="space-y-4">
                <div className="p-6 bg-[#0f1911] border border-[#22c55e] rounded-lg">
                  <h4 className="font-bold mb-2 text-[#22c55e]">✅ If Approved:</h4>
                  <ul className="list-disc list-inside text-[#888] space-y-1">
                    <li>
                      Your NEXUS card will be mailed to you within 7-10 business days
                    </li>
                    <li>You can start using your NEXUS benefits immediately</li>
                    <li>Your membership is valid for 5 years from the approval date</li>
                    <li>
                      Add your NEXUS number (also called PASSID) to airline profiles for
                      TSA PreCheck
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-[#111] border border-[#222] rounded-lg">
                  <h4 className="font-bold mb-2 text-[#ededed]">
                    ⏳ If Pending Additional Review:
                  </h4>
                  <p className="text-[#888] text-sm mb-2">
                    Sometimes officers need to verify additional information before
                    approving. You'll be notified via email or mail within 30 days.
                  </p>
                </div>

                <div className="p-6 bg-[#1f0808] border border-[#ef4444] rounded-lg">
                  <h4 className="font-bold mb-2 text-[#ef4444]">❌ If Denied:</h4>
                  <p className="text-[#888] text-sm mb-2">
                    You'll receive a denial letter explaining the reason. Common reasons
                    include:
                  </p>
                  <ul className="list-disc list-inside text-[#888] space-y-1 text-sm">
                    <li>Criminal convictions (especially DUI or customs violations)</li>
                    <li>False information on the application</li>
                    <li>Immigration violations or overstays</li>
                    <li>Outstanding warrants or legal issues</li>
                  </ul>
                  <p className="text-[#888] text-sm mt-3">
                    You can reapply after 1 year, but you must address the underlying issue
                    first.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">
                Tips for First-Time NEXUS Applicants
              </h2>
              <ul className="space-y-3 text-[#888]">
                <li className="flex items-start">
                  <span className="text-[#3b82f6] mr-2 mt-1 text-xl">•</span>
                  <div>
                    <strong className="text-[#ededed]">Practice your answers:</strong> Review
                    the common questions above and practice answering them out loud. You
                    want to sound confident and natural, not rehearsed or nervous.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3b82f6] mr-2 mt-1 text-xl">•</span>
                  <div>
                    <strong className="text-[#ededed]">
                      Be prepared to explain your travel patterns:
                    </strong>{' '}
                    If you've traveled to high-risk countries or have unusual travel
                    frequency, be ready to explain the purpose (work, tourism, family,
                    etc.).
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3b82f6] mr-2 mt-1 text-xl">•</span>
                  <div>
                    <strong className="text-[#ededed]">Know your dates:</strong> Officers
                    may ask specific dates about your employment, travel, or address
                    history. Have this information fresh in your mind.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3b82f6] mr-2 mt-1 text-xl">•</span>
                  <div>
                    <strong className="text-[#ededed]">
                      Don't bring children unless they're also applying:
                    </strong>{' '}
                    The enrollment center is a secure area. Leave kids at home if they're
                    not interviewing.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3b82f6] mr-2 mt-1 text-xl">•</span>
                  <div>
                    <strong className="text-[#ededed]">Check border wait times:</strong> If
                    your enrollment center is on the US side and you're crossing from
                    Canada (or vice versa), check border wait times before you leave.
                  </div>
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">Final Checklist</h2>
              <div className="bg-[#0f1729] border border-[#3b82f6] rounded-lg p-6">
                <h3 className="font-bold mb-4 text-[#ededed]">
                  The Night Before Your Interview:
                </h3>
                <ul className="space-y-2 text-[#888]">
                  <li className="flex items-start">
                    <span className="text-[#3b82f6] mr-2">☐</span>
                    <span>Print and review your GOES conditional approval letter</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3b82f6] mr-2">☐</span>
                    <span>Gather all required documents and place them in a folder</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3b82f6] mr-2">☐</span>
                    <span>Review your application answers from GOES</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3b82f6] mr-2">☐</span>
                    <span>Set an alarm to arrive 30 minutes early</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3b82f6] mr-2">☐</span>
                    <span>Check border wait times and plan your route</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3b82f6] mr-2">☐</span>
                    <span>
                      Choose professional attire (business casual minimum)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3b82f6] mr-2">☐</span>
                    <span>
                      Practice answering common interview questions out loud
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#ededed]">
                Final Thoughts
              </h2>
              <p className="text-[#888] leading-relaxed mb-4">
                The NEXUS interview is straightforward if you're prepared. Bring the right
                documents, answer honestly, and present yourself professionally. Most
                applicants pass on the first try.
              </p>
              <p className="text-[#888] leading-relaxed mb-4">
                The key is preparation. Review your application, organize your documents,
                and practice your answers to common questions. Officers aren't trying to
                trick you—they're simply verifying that you're a low-risk traveler who can
                be trusted with expedited border crossing privileges.
              </p>
              <p className="text-[#888] leading-relaxed">
                Once approved, you'll enjoy 5 years of expedited travel through US and
                Canadian borders, TSA PreCheck access, and significantly shorter wait times
                at airports and border crossings. It's worth the effort.
              </p>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 rounded-xl border border-[#3b82f6] bg-[#0f1729] text-center">
            <h2 className="text-2xl font-bold mb-3">
              Ready to Book Your NEXUS Interview?
            </h2>
            <p className="text-[#888] mb-6 max-w-xl mx-auto">
              Finding an available interview slot can take months. NEXUS Alert monitors
              appointment availability 24/7 and notifies you instantly when slots open up.
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
