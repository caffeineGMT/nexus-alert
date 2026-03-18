'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

const sections = [
  { id: 'overview', title: 'Overview' },
  { id: 'data-collection', title: 'What Data We Collect' },
  { id: 'external-services', title: 'External Services' },
  { id: 'data-retention', title: 'Data Retention' },
  { id: 'permissions', title: 'Permissions' },
  { id: 'your-rights', title: 'Your Rights' },
  { id: 'data-security', title: 'Data Security' },
  { id: 'children', title: "Children's Privacy" },
  { id: 'international', title: 'International Users' },
  { id: 'third-party', title: 'Third-Party Services' },
  { id: 'open-source', title: 'Open Source' },
  { id: 'cookies', title: 'Cookies' },
  { id: 'changes', title: 'Changes to This Policy' },
  { id: 'not-affiliated', title: 'Not Affiliated with CBP/DHS' },
  { id: 'contact', title: 'Contact' },
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('overview');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show scroll-to-top button after 500px
      setShowScrollTop(window.scrollY > 500);

      // Update active section based on scroll position
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#2563EB] hover:text-[#1E40AF] transition">
            NEXUS Alert
          </Link>
          <Link href="/" className="text-[#6B7280] hover:text-[#111827] transition text-sm">
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="pt-24 pb-4 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-sm text-[#6B7280]">
            <Link href="/" className="hover:text-[#2563EB]">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#111827]">Privacy Policy</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-16">
        <div className="max-w-7xl mx-auto flex gap-8">
          {/* Table of Contents - Desktop Only */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-24">
              <h3 className="text-sm font-bold text-[#111827] mb-4 uppercase tracking-wide">Contents</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`block w-full text-left text-sm py-1.5 px-3 rounded transition ${
                      activeSection === section.id
                        ? 'bg-[#2563EB] text-white font-semibold'
                        : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6]'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 max-w-3xl">
            <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-8 lg:p-12">
              {/* Header */}
              <div className="mb-12">
                <h1 className="text-5xl font-bold text-[#111827] mb-4">Privacy Policy</h1>
                <p className="text-[#6B7280] text-lg">
                  <strong>Last updated:</strong> March 18, 2026
                </p>
                <p className="text-[#6B7280] text-lg">
                  <strong>Effective Date:</strong> March 18, 2026
                </p>
              </div>

              {/* Overview */}
              <section id="overview" className="mb-12">
                <h2 className="text-3xl font-bold text-[#111827] mt-8 mb-4">Overview</h2>
                <p className="text-[#111827] text-lg leading-relaxed mb-4">
                  NEXUS Alert is a Chrome extension that monitors appointment availability on the CBP Trusted Traveler Programs website (ttp.cbp.dhs.gov). Your privacy is important to us. This policy explains what data we collect, how we use it, and your choices.
                </p>
              </section>

              <hr className="border-[#E5E7EB] my-8" />

              {/* What Data We Collect */}
              <section id="data-collection" className="mb-12">
                <h2 className="text-3xl font-bold text-[#111827] mt-8 mb-4">What Data We Collect</h2>

                <h3 className="text-2xl font-semibold text-[#111827] mt-6 mb-3">Free Tier (No Account Required)</h3>
                <p className="text-[#111827] text-lg leading-relaxed mb-4">
                  <strong className="text-[#2563EB]">We collect ZERO personal data.</strong> All data stays in your browser.
                </p>
                <p className="text-[#111827] text-lg leading-relaxed mb-4">
                  The extension stores the following data <strong>locally in your browser</strong> (chrome.storage.local):
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-[#111827] text-lg leading-relaxed">
                  <li><strong>User preferences:</strong> Selected program (NEXUS/Global Entry/SENTRI), enrollment centers, date/time filters, polling interval, notification settings</li>
                  <li><strong>Slot history:</strong> A log of appointment slots discovered during monitoring, used for statistics and to avoid duplicate notifications</li>
                  <li><strong>Cached location data:</strong> Enrollment center names and addresses fetched from the CBP public API</li>
                </ul>
                <p className="text-[#111827] text-lg leading-relaxed mb-4">
                  <strong>This data never leaves your browser</strong> and is automatically deleted when you uninstall the extension.
                </p>

                <h3 className="text-2xl font-semibold text-[#111827] mt-6 mb-3">Premium Tier (Optional Paid Upgrade)</h3>
                <p className="text-[#111827] text-lg leading-relaxed mb-4">
                  If you upgrade to the Premium tier ($4.99/month), we collect:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-[#111827] text-lg leading-relaxed">
                  <li><strong>Email address:</strong> Used to send email notifications when appointment slots are found</li>
                  <li><strong>Payment information:</strong> Processed securely by Stripe (we do not store credit card details)</li>
                  <li><strong>License key:</strong> A unique identifier to verify your premium subscription</li>
                </ul>

                <p className="text-[#111827] text-lg leading-relaxed mb-3">
                  <strong>How we use this data:</strong>
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-[#111827] text-lg leading-relaxed">
                  <li>Email address: Send appointment slot notifications via Resend.com (transactional email provider)</li>
                  <li>License key: Validate your premium subscription status</li>
                </ul>

                <p className="text-[#111827] text-lg leading-relaxed mb-3">
                  <strong>We do NOT:</strong>
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-[#111827] text-lg leading-relaxed">
                  <li>Sell your email address</li>
                  <li>Share your data with third parties (except Stripe for payment processing and Resend for email delivery)</li>
                  <li>Use your data for marketing purposes without your consent</li>
                  <li>Track your browsing activity</li>
                </ul>
              </section>

              <hr className="border-[#E5E7EB] my-8" />

              {/* External Services */}
              <section id="external-services" className="mb-12">
                <h2 className="text-3xl font-bold text-[#111827] mt-8 mb-4">External Services</h2>

                <h3 className="text-2xl font-semibold text-[#111827] mt-6 mb-3">Free Tier</h3>
                <p className="text-[#111827] text-lg leading-relaxed mb-4">
                  The extension makes requests only to:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-[#111827] text-lg leading-relaxed">
                  <li><strong>ttp.cbp.dhs.gov</strong> — The official CBP Trusted Traveler Programs website, to check for available appointment slots and fetch enrollment center information. This is a public API that does not require authentication.</li>
                </ul>

                <h3 className="text-2xl font-semibold text-[#111827] mt-6 mb-3">Premium Tier</h3>
                <p className="text-[#111827] text-lg leading-relaxed mb-4">
                  The extension additionally contacts:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-[#111827] text-lg leading-relaxed">
                  <li><strong>api.nexus-alert.com</strong> — Our backend server (Cloudflare Worker) to verify your license and send email notifications</li>
                  <li><strong>Stripe</strong> — Payment processing (PCI-compliant, we never see your credit card)</li>
                  <li><strong>Resend.com</strong> — Transactional email delivery (GDPR-compliant)</li>
                </ul>
                <p className="text-[#111827] text-lg leading-relaxed mb-4">
                  No analytics, tracking, or advertising services are used.
                </p>
              </section>

              <hr className="border-[#E5E7EB] my-8" />

              {/* Data Retention */}
              <section id="data-retention" className="mb-12">
                <h2 className="text-3xl font-bold text-[#111827] mt-8 mb-4">Data Retention</h2>

                <h3 className="text-2xl font-semibold text-[#111827] mt-6 mb-3">Free Tier</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-[#111827] text-lg leading-relaxed">
                  <li>Local data is stored indefinitely until you uninstall the extension or clear browser data</li>
                </ul>

                <h3 className="text-2xl font-semibold text-[#111827] mt-6 mb-3">Premium Tier</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-[#111827] text-lg leading-relaxed">
                  <li>Email address: Stored until you cancel your subscription</li>
                  <li>License keys: Stored as long as your account is active</li>
                  <li>Payment history: Retained by Stripe per their policies</li>
                  <li>You can request data deletion at any time by emailing support@nexus-alert.com</li>
                </ul>
              </section>

              <hr className="border-[#E5E7EB] my-8" />

              {/* Permissions */}
              <section id="permissions" className="mb-12">
                <h2 className="text-3xl font-bold text-[#111827] mt-8 mb-4">Permissions</h2>
                <p className="text-[#111827] text-lg leading-relaxed mb-4">
                  The extension requests the following Chrome permissions:
                </p>

                <div className="overflow-x-auto mb-6">
                  <table className="w-full border border-[#E5E7EB]">
                    <thead>
                      <tr className="bg-[#F3F4F6]">
                        <th className="text-left py-3 px-4 font-semibold text-[#111827] border-b border-[#E5E7EB]">Permission</th>
                        <th className="text-left py-3 px-4 font-semibold text-[#111827] border-b border-[#E5E7EB]">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#111827] text-lg">
                      <tr className="border-b border-[#E5E7EB]">
                        <td className="py-3 px-4"><code className="bg-[#F3F4F6] px-2 py-1 rounded text-sm">alarms</code></td>
                        <td className="py-3 px-4">Schedule periodic slot checks in the background</td>
                      </tr>
                      <tr className="border-b border-[#E5E7EB]">
                        <td className="py-3 px-4"><code className="bg-[#F3F4F6] px-2 py-1 rounded text-sm">notifications</code></td>
                        <td className="py-3 px-4">Show desktop notifications when slots are found</td>
                      </tr>
                      <tr className="border-b border-[#E5E7EB]">
                        <td className="py-3 px-4"><code className="bg-[#F3F4F6] px-2 py-1 rounded text-sm">storage</code></td>
                        <td className="py-3 px-4">Save your preferences and slot history locally</td>
                      </tr>
                      <tr className="border-b border-[#E5E7EB]">
                        <td className="py-3 px-4"><code className="bg-[#F3F4F6] px-2 py-1 rounded text-sm">offscreen</code></td>
                        <td className="py-3 px-4">Play sound alerts when new slots appear (Manifest V3 requirement)</td>
                      </tr>
                      <tr className="border-b border-[#E5E7EB]">
                        <td className="py-3 px-4"><code className="bg-[#F3F4F6] px-2 py-1 rounded text-sm">tabs</code></td>
                        <td className="py-3 px-4">Open the booking page when you click a notification</td>
                      </tr>
                      <tr className="border-b border-[#E5E7EB]">
                        <td className="py-3 px-4"><code className="bg-[#F3F4F6] px-2 py-1 rounded text-sm">https://ttp.cbp.dhs.gov/*</code></td>
                        <td className="py-3 px-4">Access the CBP scheduler API to check for available slots</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4"><code className="bg-[#F3F4F6] px-2 py-1 rounded text-sm">https://api.nexus-alert.com/*</code></td>
                        <td className="py-3 px-4">Premium tier: Verify license and send email notifications</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <hr className="border-[#E5E7EB] my-8" />

              {/* Your Rights */}
              <section id="your-rights" className="mb-12">
                <h2 className="text-3xl font-bold text-[#111827] mt-8 mb-4">Your Rights (GDPR, CCPA, etc.)</h2>
                <p className="text-[#111827] text-lg leading-relaxed mb-4">
                  If you are a Premium user, you have the right to:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-[#111827] text-lg leading-relaxed">
                  <li><strong>Access</strong> your data — Email us to request a copy of your stored data</li>
                  <li><strong>Deletion</strong> — Request deletion of your email and license key</li>
                  <li><strong>Portability</strong> — Receive your data in a machine-readable format</li>
                  <li><strong>Correction</strong> — Update your email address</li>
                  <li><strong>Opt-out</strong> — Cancel your subscription and stop email notifications</li>
                </ul>
                <p className="text-[#111827] text-lg leading-relaxed mb-4">
                  To exercise these rights, email: <a href="mailto:support@nexus-alert.com" className="text-[#2563EB] hover:underline font-semibold">support@nexus-alert.com</a>
                </p>
              </section>

              <hr className="border-[#E5E7EB] my-8" />

              {/* Data Security */}
              <section id="data-security" className="mb-12">
                <h2 className="text-3xl font-bold text-[#111827] mt-8 mb-4">Data Security</h2>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-[#111827] text-lg leading-relaxed">
                  <li>All data transmitted to our backend is encrypted via HTTPS (TLS 1.2+)</li>
                  <li>Premium user data is stored in Cloudflare KV (encrypted at rest)</li>
                  <li>Payment processing is handled by Stripe (PCI DSS Level 1 compliant)</li>
                  <li>Email delivery via Resend (SOC 2 Type II certified)</li>
                </ul>
              </section>

              <hr className="border-[#E5E7EB] my-8" />

              {/* Children's Privacy */}
              <section id="children" className="mb-12">
                <h2 className="text-3xl font-bold text-[#111827] mt-8 mb-4">Children's Privacy</h2>
                <p className="text-[#111827] text-lg leading-relaxed mb-4">
                  NEXUS Alert is not intended for users under 13 years of age. We do not knowingly collect data from children.
                </p>
              </section>

              <hr className="border-[#E5E7EB] my-8" />

              {/* International Users */}
              <section id="international" className="mb-12">
                <h2 className="text-3xl font-bold text-[#111827] mt-8 mb-4">International Users</h2>
                <p className="text-[#111827] text-lg leading-relaxed mb-4">
                  If you are outside the United States:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-[#111827] text-lg leading-relaxed">
                  <li>Your data may be transferred to and processed in the United States</li>
                  <li>We comply with GDPR (EU), PIPEDA (Canada), and CCPA (California)</li>
                  <li>You have the same rights as outlined above</li>
                </ul>
              </section>

              <hr className="border-[#E5E7EB] my-8" />

              {/* Third-Party Services */}
              <section id="third-party" className="mb-12">
                <h2 className="text-3xl font-bold text-[#111827] mt-8 mb-4">Third-Party Services</h2>
                <p className="text-[#111827] text-lg leading-relaxed mb-4">
                  We use the following third-party services:
                </p>

                <div className="overflow-x-auto mb-6">
                  <table className="w-full border border-[#E5E7EB]">
                    <thead>
                      <tr className="bg-[#F3F4F6]">
                        <th className="text-left py-3 px-4 font-semibold text-[#111827] border-b border-[#E5E7EB]">Service</th>
                        <th className="text-left py-3 px-4 font-semibold text-[#111827] border-b border-[#E5E7EB]">Purpose</th>
                        <th className="text-left py-3 px-4 font-semibold text-[#111827] border-b border-[#E5E7EB]">Privacy Policy</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#111827] text-lg">
                      <tr className="border-b border-[#E5E7EB]">
                        <td className="py-3 px-4 font-semibold">Stripe</td>
                        <td className="py-3 px-4">Payment processing</td>
                        <td className="py-3 px-4">
                          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline">
                            stripe.com/privacy
                          </a>
                        </td>
                      </tr>
                      <tr className="border-b border-[#E5E7EB]">
                        <td className="py-3 px-4 font-semibold">Resend</td>
                        <td className="py-3 px-4">Email notifications</td>
                        <td className="py-3 px-4">
                          <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline">
                            resend.com/legal/privacy-policy
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold">Cloudflare</td>
                        <td className="py-3 px-4">Backend infrastructure</td>
                        <td className="py-3 px-4">
                          <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline">
                            cloudflare.com/privacypolicy
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <hr className="border-[#E5E7EB] my-8" />

              {/* Open Source */}
              <section id="open-source" className="mb-12">
                <h2 className="text-3xl font-bold text-[#111827] mt-8 mb-4">Open Source</h2>
                <p className="text-[#111827] text-lg leading-relaxed mb-4">
                  The complete source code is available at: <a href="https://github.com/caffeineGMT/nexus-alert" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline font-semibold">https://github.com/caffeineGMT/nexus-alert</a>
                </p>
                <p className="text-[#111827] text-lg leading-relaxed mb-4">
                  You can verify exactly what data is collected and how it's used.
                </p>
              </section>

              <hr className="border-[#E5E7EB] my-8" />

              {/* Cookies */}
              <section id="cookies" className="mb-12">
                <h2 className="text-3xl font-bold text-[#111827] mt-8 mb-4">Cookies</h2>
                <p className="text-[#111827] text-lg leading-relaxed mb-4">
                  We do not use cookies in the extension or on our backend.
                </p>
              </section>

              <hr className="border-[#E5E7EB] my-8" />

              {/* Changes to This Policy */}
              <section id="changes" className="mb-12">
                <h2 className="text-3xl font-bold text-[#111827] mt-8 mb-4">Changes to This Policy</h2>
                <p className="text-[#111827] text-lg leading-relaxed mb-4">
                  We may update this privacy policy from time to time. Changes will be posted at this URL with an updated "Last updated" date. Continued use after changes constitutes acceptance.
                </p>
              </section>

              <hr className="border-[#E5E7EB] my-8" />

              {/* Not Affiliated with CBP/DHS */}
              <section id="not-affiliated" className="mb-12">
                <h2 className="text-3xl font-bold text-[#111827] mt-8 mb-4">Not Affiliated with CBP or DHS</h2>
                <p className="text-[#111827] text-lg leading-relaxed mb-4">
                  NEXUS Alert is an independent tool. We are not affiliated with, endorsed by, or sponsored by U.S. Customs and Border Protection (CBP), the Department of Homeland Security (DHS), or any government agency.
                </p>
              </section>

              <hr className="border-[#E5E7EB] my-8" />

              {/* Contact */}
              <section id="contact" className="mb-12">
                <h2 className="text-3xl font-bold text-[#111827] mt-8 mb-4">Contact</h2>
                <p className="text-[#111827] text-lg leading-relaxed mb-4">
                  For privacy questions or data requests, email: <a href="mailto:support@nexus-alert.com" className="text-[#2563EB] hover:underline font-semibold">support@nexus-alert.com</a>
                </p>
                <p className="text-[#111827] text-lg leading-relaxed mb-4">
                  Or open an issue on GitHub: <a href="https://github.com/caffeineGMT/nexus-alert/issues" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline font-semibold">https://github.com/caffeineGMT/nexus-alert/issues</a>
                </p>
              </section>

              <hr className="border-[#E5E7EB] my-8" />

              {/* Summary */}
              <div className="bg-[#F3F4F6] rounded-lg p-6 mt-8">
                <h3 className="text-xl font-bold text-[#111827] mb-3">Summary:</h3>
                <ul className="list-disc pl-6 space-y-2 text-[#111827] text-lg leading-relaxed">
                  <li>Free tier: Zero data collection, everything stays in your browser</li>
                  <li>Premium tier: We collect your email (for notifications) and process payments via Stripe</li>
                  <li>No tracking, no ads, no data selling</li>
                  <li>Open source and transparent</li>
                </ul>
              </div>

              {/* CTA */}
              <div className="mt-12 text-center">
                <Link
                  href="/"
                  className="inline-block px-8 py-4 rounded-lg bg-[#2563EB] text-white font-semibold text-lg hover:bg-[#1E40AF] transition shadow-lg"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#2563EB] text-white shadow-lg hover:bg-[#1E40AF] transition flex items-center justify-center z-40"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#6B7280] mb-4">
            NEXUS Alert is free and open source. Not affiliated with CBP or DHS.
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/privacy" className="text-[#2563EB] hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[#2563EB] hover:underline">
              Terms of Service
            </Link>
            <a
              href="https://github.com/caffeineGMT/nexus-alert"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2563EB] hover:underline"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
