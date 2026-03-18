import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Terms of Service — NEXUS Alert',
  description: 'Terms of service for NEXUS Alert Chrome extension and services.',
  robots: 'noindex, nofollow',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight hover:text-[#3b82f6] transition">
            NEXUS Alert
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-[#888] mb-8">Last updated: March 18, 2026</p>

          <div className="space-y-8 text-[#ededed]">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-[#bbb] leading-relaxed mb-3">
                Welcome to NEXUS Alert. By installing, accessing, or using the NEXUS Alert Chrome extension and related services (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.
              </p>
              <p className="text-[#bbb] leading-relaxed">
                These Terms constitute a legally binding agreement between you and NEXUS Alert ("we," "us," or "our"). We reserve the right to update these Terms at any time. Your continued use of the Service after changes are posted constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p className="text-[#bbb] leading-relaxed mb-3">
                NEXUS Alert is a Chrome browser extension that monitors the U.S. Customs and Border Protection (CBP) Global Online Enrollment System (GOES) for available appointment slots for Trusted Traveler Programs, including:
              </p>
              <ul className="list-disc list-inside text-[#bbb] space-y-2 mb-4 ml-4">
                <li>NEXUS (US-Canada border program)</li>
                <li>Global Entry (US customs expedited clearance)</li>
                <li>SENTRI (US-Mexico border program)</li>
              </ul>
              <p className="text-[#bbb] leading-relaxed mb-3">
                The Service provides two tiers:
              </p>
              <ul className="list-disc list-inside text-[#bbb] space-y-2 ml-4">
                <li><strong>Free Tier:</strong> Local browser-based monitoring with desktop and sound notifications, checks every 30 minutes</li>
                <li><strong>Premium Tier:</strong> Server-based monitoring with email and optional SMS notifications, checks every 2 minutes, $4.99 USD per month</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Obligations</h2>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">3.1 Eligibility</h3>
              <p className="text-[#bbb] leading-relaxed mb-4">
                You must be at least 18 years old to use the Service. By using the Service, you represent and warrant that you meet this age requirement.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">3.2 Lawful Use</h3>
              <p className="text-[#bbb] leading-relaxed mb-3">
                You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:
              </p>
              <ul className="list-disc list-inside text-[#bbb] space-y-2 mb-4 ml-4">
                <li>Use the Service to violate any applicable laws or regulations</li>
                <li>Attempt to circumvent, disable, or interfere with security features of the Service</li>
                <li>Use the Service to harass, abuse, or harm another person</li>
                <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                <li>Use automated systems (bots, scrapers) to abuse the Service or CBP systems</li>
                <li>Resell, redistribute, or sublicense access to the Service</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
                <li>Transmit malware, viruses, or harmful code</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">3.3 Account Security</h3>
              <p className="text-[#bbb] leading-relaxed">
                For Premium users, you are responsible for maintaining the confidentiality of your license key and account credentials. You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Payment Terms (Premium Tier)</h2>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">4.1 Subscription Fee</h3>
              <p className="text-[#bbb] leading-relaxed mb-4">
                NEXUS Alert Premium is billed at $4.99 USD per month, charged automatically on a recurring monthly basis. Prices are subject to change with 30 days' advance notice.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">4.2 Payment Processing</h3>
              <p className="text-[#bbb] leading-relaxed mb-4">
                All payments are processed securely through Stripe. We do not store your credit card information. By subscribing, you authorize us to charge your payment method on a recurring basis.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">4.3 Cancellation</h3>
              <p className="text-[#bbb] leading-relaxed mb-4">
                You may cancel your Premium subscription at any time from your account settings or by contacting us. Cancellations take effect at the end of your current billing period. You will retain Premium access until that date. We do not provide prorated refunds for partial months.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">4.4 Refund Policy</h3>
              <p className="text-[#bbb] leading-relaxed mb-4">
                We offer a 30-day money-back guarantee. If you are not satisfied with Premium within the first 30 days of your initial subscription, contact us for a full refund. Refunds after 30 days are granted at our sole discretion.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">4.5 Failed Payments</h3>
              <p className="text-[#bbb] leading-relaxed">
                If a payment fails, we will attempt to retry the charge. If payment cannot be processed after multiple attempts, your Premium subscription will be downgraded to the Free tier. You remain responsible for any outstanding amounts owed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. No Guarantees</h2>
              <p className="text-[#bbb] leading-relaxed mb-3">
                <strong>IMPORTANT:</strong> NEXUS Alert is a monitoring tool only. We do not guarantee:
              </p>
              <ul className="list-disc list-inside text-[#bbb] space-y-2 mb-4 ml-4">
                <li>That you will find or secure an appointment slot</li>
                <li>That all available slots will be detected</li>
                <li>The accuracy or completeness of appointment data from CBP systems</li>
                <li>Uninterrupted, error-free, or secure operation of the Service</li>
                <li>That the Service will meet your specific requirements</li>
              </ul>
              <p className="text-[#bbb] leading-relaxed">
                The Service monitors publicly available data from ttp.cbp.dhs.gov. We are not affiliated with, endorsed by, or connected to U.S. Customs and Border Protection (CBP), the Department of Homeland Security (DHS), or any government agency.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">6.1 Ownership</h3>
              <p className="text-[#bbb] leading-relaxed mb-4">
                NEXUS Alert and all related content, features, and functionality (including but not limited to software, text, graphics, logos, and design) are owned by NEXUS Alert and are protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">6.2 License</h3>
              <p className="text-[#bbb] leading-relaxed mb-4">
                We grant you a limited, non-exclusive, non-transferable, revocable license to use the Service for personal, non-commercial purposes in accordance with these Terms. This license does not include the right to: (a) resell or commercial use the Service; (b) modify or make derivative works; (c) use data mining, robots, or similar data gathering tools; or (d) download any portion except as expressly permitted.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">6.3 Open Source</h3>
              <p className="text-[#bbb] leading-relaxed">
                Certain components of NEXUS Alert may be distributed under open source licenses. Those components are governed by the applicable open source license terms, which can be found in our GitHub repository.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Disclaimer of Warranties</h2>
              <p className="text-[#bbb] leading-relaxed mb-3">
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc list-inside text-[#bbb] space-y-2 mb-4 ml-4">
                <li>Implied warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
                <li>Warranties that the Service will be uninterrupted, secure, or error-free</li>
                <li>Warranties regarding the accuracy, reliability, or completeness of content</li>
              </ul>
              <p className="text-[#bbb] leading-relaxed">
                Some jurisdictions do not allow the exclusion of implied warranties, so some of the above exclusions may not apply to you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
              <p className="text-[#bbb] leading-relaxed mb-3">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL NEXUS ALERT, ITS AFFILIATES, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR:
              </p>
              <ul className="list-disc list-inside text-[#bbb] space-y-2 mb-4 ml-4">
                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, revenue, data, use, goodwill, or other intangible losses</li>
                <li>Damages resulting from your use or inability to use the Service</li>
                <li>Damages resulting from missed appointment opportunities</li>
                <li>Unauthorized access to or alteration of your data</li>
                <li>Statements or conduct of any third party on the Service</li>
              </ul>
              <p className="text-[#bbb] leading-relaxed mb-3">
                OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING FROM OR RELATED TO THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRIOR TO THE EVENT GIVING RISE TO LIABILITY, OR $100 USD, WHICHEVER IS GREATER.
              </p>
              <p className="text-[#bbb] leading-relaxed">
                This limitation applies regardless of the legal theory (contract, tort, strict liability, or otherwise) and even if we have been advised of the possibility of such damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
              <p className="text-[#bbb] leading-relaxed">
                You agree to defend, indemnify, and hold harmless NEXUS Alert and its affiliates, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses (including reasonable attorneys' fees) arising out of or related to: (a) your use of the Service; (b) your violation of these Terms; (c) your violation of any rights of another party; or (d) your violation of any applicable laws or regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Third-Party Services</h2>
              <p className="text-[#bbb] leading-relaxed mb-3">
                The Service integrates with third-party services and websites, including:
              </p>
              <ul className="list-disc list-inside text-[#bbb] space-y-2 mb-4 ml-4">
                <li>ttp.cbp.dhs.gov (U.S. Customs and Border Protection GOES system)</li>
                <li>Stripe (payment processing)</li>
                <li>Email and SMS notification providers</li>
              </ul>
              <p className="text-[#bbb] leading-relaxed">
                We are not responsible for the content, policies, or practices of any third-party services. Your use of third-party services is at your own risk and subject to their respective terms and privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">11.1 Termination by You</h3>
              <p className="text-[#bbb] leading-relaxed mb-4">
                You may stop using the Service at any time by uninstalling the extension and canceling any Premium subscription.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">11.2 Termination by Us</h3>
              <p className="text-[#bbb] leading-relaxed mb-4">
                We may suspend or terminate your access to the Service at any time, with or without cause, with or without notice, including for: (a) violation of these Terms; (b) fraudulent, harassing, or illegal activity; (c) extended periods of inactivity; or (d) at our sole discretion.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">11.3 Effect of Termination</h3>
              <p className="text-[#bbb] leading-relaxed">
                Upon termination, your right to use the Service will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Dispute Resolution</h2>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">12.1 Informal Resolution</h3>
              <p className="text-[#bbb] leading-relaxed mb-4">
                Before filing a claim, you agree to contact us at support@nexus-alert.com and attempt to resolve the dispute informally for at least 30 days.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">12.2 Arbitration Agreement</h3>
              <p className="text-[#bbb] leading-relaxed mb-4">
                Any dispute arising from or relating to these Terms or the Service will be resolved through binding arbitration, except that either party may seek injunctive relief in court for infringement of intellectual property rights. Arbitration will be conducted by a single arbitrator in accordance with the rules of the American Arbitration Association. You waive your right to a jury trial.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">12.3 Class Action Waiver</h3>
              <p className="text-[#bbb] leading-relaxed">
                You agree that any arbitration or proceeding will be limited to the dispute between you and NEXUS Alert individually. You waive any right to participate in a class action lawsuit or class-wide arbitration.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
              <p className="text-[#bbb] leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions. You consent to the exclusive jurisdiction of the courts located in Delaware for any disputes not subject to arbitration.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">14. Changes to Terms</h2>
              <p className="text-[#bbb] leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify you of material changes by posting a notice on our website or within the extension. Your continued use of the Service after changes are posted constitutes acceptance of the updated Terms. If you do not agree to the new Terms, you must stop using the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">15. Severability</h2>
              <p className="text-[#bbb] leading-relaxed">
                If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">16. Entire Agreement</h2>
              <p className="text-[#bbb] leading-relaxed">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and NEXUS Alert regarding the Service and supersede all prior agreements and understandings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">17. Contact Information</h2>
              <p className="text-[#bbb] leading-relaxed mb-3">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="text-[#bbb] space-y-2">
                <p>Email: <a href="mailto:support@nexus-alert.com" className="text-[#3b82f6] hover:underline">support@nexus-alert.com</a></p>
                <p>Legal: <a href="mailto:legal@nexus-alert.com" className="text-[#3b82f6] hover:underline">legal@nexus-alert.com</a></p>
              </div>
            </section>

            <section className="border-t border-[#222] pt-6 mt-8">
              <p className="text-[#888] text-sm">
                By using NEXUS Alert, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </section>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-lg bg-[#3b82f6] text-white font-semibold hover:bg-[#2563eb] transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#222] text-center text-sm text-[#555]">
        <p>NEXUS Alert is free and open source. Not affiliated with CBP or DHS.</p>
        <div className="mt-3 space-x-4">
          <Link href="/privacy" className="text-[#888] hover:text-[#3b82f6] transition">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-[#888] hover:text-[#3b82f6] transition">
            Terms of Service
          </Link>
          <a
            href="https://github.com/caffeineGMT/nexus-alert"
            className="text-[#888] hover:text-[#3b82f6] transition"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
