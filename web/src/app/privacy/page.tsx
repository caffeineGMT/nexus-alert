import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Privacy Policy — NEXUS Alert',
  description: 'Privacy policy for NEXUS Alert Chrome extension and services.',
  robots: 'noindex, nofollow',
};

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-[#888] mb-8">Last updated: March 18, 2026</p>

          <div className="space-y-8 text-[#ededed]">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-[#bbb] leading-relaxed mb-3">
                NEXUS Alert ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Chrome extension and related services (collectively, the "Service").
              </p>
              <p className="text-[#bbb] leading-relaxed">
                By using the Service, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">2.1 Free Extension (Local Only)</h3>
              <p className="text-[#bbb] leading-relaxed mb-3">
                When you use the free version of NEXUS Alert, all data is stored locally on your device and never transmitted to our servers:
              </p>
              <ul className="list-disc list-inside text-[#bbb] space-y-2 mb-4 ml-4">
                <li>Selected enrollment centers and locations</li>
                <li>Appointment search preferences (date ranges, time filters)</li>
                <li>Notification preferences (sound, desktop notifications)</li>
                <li>Check frequency settings</li>
                <li>Historical slot data for display purposes</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">2.2 Premium Service</h3>
              <p className="text-[#bbb] leading-relaxed mb-3">
                When you subscribe to NEXUS Alert Premium, we collect and store:
              </p>
              <ul className="list-disc list-inside text-[#bbb] space-y-2 mb-4 ml-4">
                <li><strong>Account Information:</strong> Email address, license key</li>
                <li><strong>Monitoring Preferences:</strong> Selected locations, date/time filters, check frequency</li>
                <li><strong>Notification Settings:</strong> Email address, phone number (for SMS, optional)</li>
                <li><strong>Payment Information:</strong> Processed by Stripe (we do not store credit card details)</li>
                <li><strong>Usage Data:</strong> Number of checks performed, notifications sent, service uptime</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">2.3 Automatically Collected Information</h3>
              <p className="text-[#bbb] leading-relaxed mb-3">
                We may automatically collect certain technical information:
              </p>
              <ul className="list-disc list-inside text-[#bbb] space-y-2 ml-4">
                <li>Browser type and version</li>
                <li>Extension version</li>
                <li>Error logs and crash reports (anonymized)</li>
                <li>IP address (only for Premium server-side checks, not logged persistently)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-[#bbb] leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-[#bbb] space-y-2 ml-4">
                <li>Provide and maintain the Service</li>
                <li>Monitor NEXUS/Global Entry/SENTRI appointment availability</li>
                <li>Send you notifications about available appointment slots</li>
                <li>Process payments and manage subscriptions</li>
                <li>Respond to your customer service requests</li>
                <li>Improve and optimize the Service</li>
                <li>Detect, prevent, and address technical issues</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Third Parties</h2>
              <p className="text-[#bbb] leading-relaxed mb-3">
                We do not sell, trade, or rent your personal information. We may share your information with the following third parties:
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">4.1 Service Providers</h3>
              <ul className="list-disc list-inside text-[#bbb] space-y-2 mb-4 ml-4">
                <li><strong>Stripe:</strong> Payment processing (PCI-DSS compliant)</li>
                <li><strong>Resend/Email Provider:</strong> Transactional email notifications</li>
                <li><strong>Twilio:</strong> SMS notifications (Premium users only, if enabled)</li>
                <li><strong>Cloudflare:</strong> Infrastructure and security</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">4.2 Legal Requirements</h3>
              <p className="text-[#bbb] leading-relaxed mb-3">
                We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., court orders, subpoenas).
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">4.3 Business Transfers</h3>
              <p className="text-[#bbb] leading-relaxed">
                If NEXUS Alert is involved in a merger, acquisition, or sale of assets, your information may be transferred. We will notify you before your information is transferred and becomes subject to a different privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
              <p className="text-[#bbb] leading-relaxed mb-3">
                We retain your personal information only for as long as necessary:
              </p>
              <ul className="list-disc list-inside text-[#bbb] space-y-2 ml-4">
                <li><strong>Active Premium Subscriptions:</strong> Data retained for the duration of your subscription</li>
                <li><strong>After Cancellation:</strong> Data deleted within 30 days of subscription end</li>
                <li><strong>Email Marketing:</strong> Retained until you unsubscribe</li>
                <li><strong>Legal Requirements:</strong> Certain data may be retained longer to comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Your Privacy Rights</h2>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">6.1 GDPR Rights (EU Users)</h3>
              <p className="text-[#bbb] leading-relaxed mb-3">
                If you are located in the European Economic Area (EEA), you have the following rights:
              </p>
              <ul className="list-disc list-inside text-[#bbb] space-y-2 mb-4 ml-4">
                <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your data</li>
                <li><strong>Right to Restriction:</strong> Limit how we use your data</li>
                <li><strong>Right to Data Portability:</strong> Receive your data in a machine-readable format</li>
                <li><strong>Right to Object:</strong> Object to processing of your data</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">6.2 CCPA Rights (California Users)</h3>
              <p className="text-[#bbb] leading-relaxed mb-3">
                If you are a California resident, you have the following rights under the California Consumer Privacy Act (CCPA):
              </p>
              <ul className="list-disc list-inside text-[#bbb] space-y-2 mb-4 ml-4">
                <li><strong>Right to Know:</strong> What personal information we collect, use, and share</li>
                <li><strong>Right to Delete:</strong> Request deletion of your personal information</li>
                <li><strong>Right to Opt-Out:</strong> Opt-out of the sale of personal information (we do not sell data)</li>
                <li><strong>Right to Non-Discrimination:</strong> Equal service regardless of privacy choices</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#ddd]">6.3 Exercising Your Rights</h3>
              <p className="text-[#bbb] leading-relaxed mb-3">
                To exercise any of these rights, please contact us at:
              </p>
              <p className="text-[#3b82f6] mb-3">
                Email: <a href="mailto:privacy@nexus-alert.com" className="hover:underline">privacy@nexus-alert.com</a>
              </p>
              <p className="text-[#bbb] leading-relaxed">
                We will respond to your request within 30 days. For Premium users, you can also delete your account and all associated data directly from the extension settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Data Security</h2>
              <p className="text-[#bbb] leading-relaxed mb-3">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc list-inside text-[#bbb] space-y-2 ml-4">
                <li>Data encrypted in transit using TLS/SSL</li>
                <li>Data encrypted at rest</li>
                <li>Secure authentication using license keys and HMAC verification</li>
                <li>Regular security audits and updates</li>
                <li>Limited employee access to personal data</li>
              </ul>
              <p className="text-[#bbb] leading-relaxed mt-3">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking</h2>
              <p className="text-[#bbb] leading-relaxed mb-3">
                The NEXUS Alert extension does not use cookies or third-party tracking. Our website may use:
              </p>
              <ul className="list-disc list-inside text-[#bbb] space-y-2 ml-4">
                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                <li><strong>Analytics:</strong> We do not currently use analytics tracking</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
              <p className="text-[#bbb] leading-relaxed">
                NEXUS Alert is not intended for children under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
              <p className="text-[#bbb] leading-relaxed">
                Your information may be transferred to and maintained on servers located outside of your jurisdiction. By using the Service, you consent to the transfer of information to countries that may have different data protection laws than your country of residence.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Third-Party Links</h2>
              <p className="text-[#bbb] leading-relaxed">
                The Service may contain links to third-party websites (e.g., ttp.cbp.dhs.gov). We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-[#bbb] leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. For material changes, we will provide prominent notice or obtain consent as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
              <p className="text-[#bbb] leading-relaxed mb-3">
                If you have questions or concerns about this Privacy Policy, please contact us:
              </p>
              <div className="text-[#bbb] space-y-2">
                <p>Email: <a href="mailto:privacy@nexus-alert.com" className="text-[#3b82f6] hover:underline">privacy@nexus-alert.com</a></p>
                <p>Email (General): <a href="mailto:support@nexus-alert.com" className="text-[#3b82f6] hover:underline">support@nexus-alert.com</a></p>
              </div>
            </section>

            <section className="border-t border-[#222] pt-6 mt-8">
              <p className="text-[#888] text-sm">
                By using NEXUS Alert, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
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
