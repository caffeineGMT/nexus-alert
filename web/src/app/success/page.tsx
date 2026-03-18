'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [email, setEmail] = useState<string | null>(null);
  const [referralUrl, setReferralUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // In a real implementation, you'd verify the session with Stripe
    // For now, we'll just show the success message
    const storedEmail = localStorage.getItem('nexus_alert_email');
    if (storedEmail) {
      setEmail(storedEmail);
      // Generate referral code from email
      const code = btoa(storedEmail).slice(0, 8);
      setReferralUrl(`https://nexus-alert.com?ref=${code}`);
    }
  }, []);

  const copyReferralUrl = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to Premium!</h1>
            <p className="text-blue-200 text-lg">
              Your subscription is now active. You'll receive email alerts every 2 minutes when slots open up.
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Next Steps</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="text-white font-medium">Install the Chrome Extension</p>
                  <p className="text-blue-200 text-sm">Get desktop notifications and manage your monitoring settings</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="text-white font-medium">Check your email</p>
                  <p className="text-blue-200 text-sm">We'll send you alerts when new slots are found</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="text-white font-medium">Book when notified</p>
                  <p className="text-blue-200 text-sm">Slots disappear quickly — book as soon as you get the alert</p>
                </div>
              </div>
            </div>
          </div>

          {/* Referral CTA */}
          {referralUrl && (
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎁</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Earn Free Months</h3>
                  <p className="text-blue-200 text-sm">
                    Share your referral link and get <strong className="text-white">1 free month</strong> when someone upgrades to Premium!
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralUrl}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm font-mono"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  onClick={copyReferralUrl}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              <div className="mt-4 flex gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    '⚡ Just upgraded to NEXUS Alert Premium! Get notified instantly when NEXUS/Global Entry appointments open up. Try it free:'
                  )}&url=${encodeURIComponent(referralUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white px-4 py-2 rounded-lg text-sm font-medium text-center transition-colors"
                >
                  Share on Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#1877F2] hover:bg-[#165ec7] text-white px-4 py-2 rounded-lg text-sm font-medium text-center transition-colors"
                >
                  Share on Facebook
                </a>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href="https://chromewebstore.google.com/detail/nexus-alert/TBD"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors"
            >
              Install Chrome Extension
            </a>
            <Link
              href="/"
              className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-blue-200 text-sm mt-6">
          Questions? Email us at{' '}
          <a href="mailto:support@nexus-alert.com" className="text-blue-400 hover:underline">
            support@nexus-alert.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
