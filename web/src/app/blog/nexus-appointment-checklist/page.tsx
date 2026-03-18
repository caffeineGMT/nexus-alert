import Link from 'next/link';
import LeadMagnetForm from '../../components/LeadMagnetForm';

export const metadata = {
  title: 'Complete NEXUS Appointment Checklist - Everything You Need | NEXUS Alert',
  description: 'Free downloadable checklist with everything you need before your NEXUS interview. Documents, fees, preparation tips, and what to expect at the enrollment center.',
};

export default function NEXUSAppointmentChecklist() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      <nav className="border-b border-[#222] bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center">
          <Link href="/" className="text-lg font-bold tracking-tight hover:text-[#3b82f6] transition">
            NEXUS Alert
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <div className="text-sm text-[#888] mb-6">
          <Link href="/" className="hover:text-[#3b82f6] transition">Home</Link>
          {' '}/{' '}
          <Link href="/blog" className="hover:text-[#3b82f6] transition">Blog</Link>
          {' '}/{' '}
          <span className="text-[#ededed]">NEXUS Appointment Checklist</span>
        </div>

        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Complete NEXUS Appointment Checklist
        </h1>
        <p className="text-lg text-[#888] mb-8">
          Everything you need before your NEXUS interview — documents, fees, what to bring, and common mistakes to avoid.
        </p>

        <div className="text-xs text-[#555] mb-12">
          Published March 18, 2026 • 5 min read
        </div>

        {/* Lead Magnet - Above the fold */}
        <LeadMagnetForm leadMagnet="checklist" />

        {/* Introduction */}
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-[#888] leading-relaxed mb-6">
            You finally got your NEXUS appointment — congratulations! Now comes the preparation. Showing up unprepared can mean delays, rescheduling, or even rejection. This checklist covers everything you need to bring, pay, and prepare for a smooth interview.
          </p>

          <h2 className="text-2xl font-bold text-[#ededed] mt-12 mb-4">
            📋 Required Documents
          </h2>
          <p className="text-[#888] leading-relaxed mb-4">
            These are mandatory. Missing even one can result in your appointment being cancelled:
          </p>

          <ul className="space-y-3 text-[#888] mb-8">
            <li className="flex items-start">
              <span className="text-[#22c55e] mr-3">✓</span>
              <div>
                <strong className="text-[#ededed]">Valid Passport</strong> — Must be valid for at least 6 months beyond your interview date.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-[#22c55e] mr-3">✓</span>
              <div>
                <strong className="text-[#ededed]">Proof of Citizenship</strong> — Birth certificate or naturalization certificate (in addition to passport).
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-[#22c55e] mr-3">✓</span>
              <div>
                <strong className="text-[#ededed]">Proof of Residency</strong> — Utility bill, lease agreement, or driver's license showing your current address.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-[#22c55e] mr-3">✓</span>
              <div>
                <strong className="text-[#ededed]">Conditional Approval Letter</strong> — Printed copy of your TTP approval email with barcode.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-[#22c55e] mr-3">✓</span>
              <div>
                <strong className="text-[#ededed]">Government-Issued ID</strong> — Driver's license or state ID card.
              </div>
            </li>
          </ul>

          <div className="bg-[#1e3a5f] border border-[#2563eb] rounded-lg p-6 my-8">
            <p className="text-[#dbeafe] text-sm mb-0">
              <strong>💡 Pro Tip:</strong> Bring originals, not photocopies. CBP officers need to verify authenticity. Keep them organized in a folder labeled "NEXUS Interview Documents."
            </p>
          </div>

          <h2 className="text-2xl font-bold text-[#ededed] mt-12 mb-4">
            💳 Payment Method
          </h2>
          <p className="text-[#888] leading-relaxed mb-4">
            You'll pay the $50 USD application fee at your interview (waived if approved conditionally online):
          </p>

          <ul className="space-y-3 text-[#888] mb-8">
            <li className="flex items-start">
              <span className="text-[#3b82f6] mr-3">•</span>
              <div>
                <strong className="text-[#ededed]">Credit or Debit Card</strong> — Visa, Mastercard, Amex accepted. Bring a backup card in case of technical issues.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-[#3b82f6] mr-3">•</span>
              <div>
                <strong className="text-[#ededed]">No Cash Accepted</strong> — Enrollment centers do NOT accept cash, checks, or money orders.
              </div>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[#ededed] mt-12 mb-4">
            🕐 Before You Arrive
          </h2>
          <ul className="space-y-3 text-[#888] mb-8">
            <li className="flex items-start">
              <span className="text-[#22c55e] mr-3">✓</span>
              <div>
                Arrive <strong>15 minutes early</strong> — Late arrivals may forfeit their appointment.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-[#22c55e] mr-3">✓</span>
              <div>
                Check enrollment center hours — Some close for lunch or have reduced weekend hours.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-[#22c55e] mr-3">✓</span>
              <div>
                Review your TTP application — Officers will ask about your travel history, employment, and addresses.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-[#22c55e] mr-3">✓</span>
              <div>
                Dress appropriately — Business casual recommended. You'll have your photo taken for your NEXUS card.
              </div>
            </li>
          </ul>

          {/* Second Lead Magnet - Mid-article */}
          <LeadMagnetForm
            leadMagnet="tips"
            title="Bonus: 10 Pro Tips to Pass Your Interview"
            description="Insider advice from people who've been through the NEXUS interview process. Download now."
          />

          <h2 className="text-2xl font-bold text-[#ededed] mt-12 mb-4">
            ❌ Common Mistakes to Avoid
          </h2>
          <ul className="space-y-3 text-[#888] mb-8">
            <li className="flex items-start">
              <span className="text-[#ef4444] mr-3">✗</span>
              <div>
                <strong className="text-[#ef4444]">Expired passport</strong> — Check expiration date before leaving home.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-[#ef4444] mr-3">✗</span>
              <div>
                <strong className="text-[#ef4444]">Mismatched addresses</strong> — Your proof of residency must match the address on your application.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-[#ef4444] mr-3">✗</span>
              <div>
                <strong className="text-[#ef4444]">No conditional approval letter</strong> — Print it before you go. Don't rely on showing it on your phone.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-[#ef4444] mr-3">✗</span>
              <div>
                <strong className="text-[#ef4444]">Bringing children unannounced</strong> — Each family member needs their own appointment.
              </div>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[#ededed] mt-12 mb-4">
            🎯 What Happens at the Interview
          </h2>
          <p className="text-[#888] leading-relaxed mb-4">
            The interview typically lasts 10-15 minutes and involves:
          </p>

          <ol className="space-y-3 text-[#888] mb-8 list-decimal list-inside">
            <li>Document verification (passport, ID, proof of residency)</li>
            <li>Fingerprinting and photograph</li>
            <li>Brief interview questions about travel, employment, and criminal history</li>
            <li>Payment of the $50 fee (if not already paid)</li>
            <li>Conditional approval or denial on the spot</li>
          </ol>

          <p className="text-[#888] leading-relaxed mb-8">
            If approved, your NEXUS card will arrive by mail within 7-10 business days.
          </p>

          <div className="bg-[#065f46] border border-[#22c55e] rounded-lg p-6 my-8">
            <p className="text-[#d1fae5] text-sm mb-0">
              <strong>✓ Success Rate:</strong> 95% of applicants who arrive prepared with all documents are approved on the spot. Follow this checklist and you'll be in that 95%.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-[#ededed] mt-12 mb-4">
            📥 Download the Full Checklist
          </h2>
          <p className="text-[#888] leading-relaxed mb-6">
            Print-friendly PDF checklist with everything you need, plus bonus tips and a timeline breakdown. Free download below:
          </p>

          <LeadMagnetForm leadMagnet="checklist" />

          <hr className="border-[#222] my-12" />

          <h2 className="text-2xl font-bold text-[#ededed] mt-12 mb-4">
            🔔 Never Miss an Appointment Opening
          </h2>
          <p className="text-[#888] leading-relaxed mb-6">
            Still looking for your first appointment? NEXUS Alert monitors the GOES system 24/7 and notifies you the instant a slot opens at your preferred enrollment center. Most users find appointments within 7 days.
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#3b82f6] text-white font-semibold text-base hover:bg-[#2563eb] transition"
          >
            Install NEXUS Alert — Free
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#222] text-center text-sm text-[#555]">
        <p>NEXUS Alert is not affiliated with CBP or DHS.</p>
        <div className="mt-3 space-x-4">
          <Link href="/privacy" className="text-[#888] hover:text-[#3b82f6] transition">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-[#888] hover:text-[#3b82f6] transition">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
