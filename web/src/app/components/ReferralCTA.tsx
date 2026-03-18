'use client';

import { useState, useEffect } from 'react';

export default function ReferralCTA() {
  const [email, setEmail] = useState<string>('');
  const [referralUrl, setReferralUrl] = useState<string>('');
  const [stats, setStats] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Get email from localStorage or config
    const storedEmail = localStorage.getItem('nexus_alert_email');
    if (storedEmail) {
      setEmail(storedEmail);
      const code = generateReferralCode(storedEmail);
      setReferralUrl(`https://nexus-alert.com?ref=${code}`);
      loadReferralStats(code);
    }
  }, []);

  const generateReferralCode = (email: string): string => {
    return btoa(email).substring(0, 8).toUpperCase();
  };

  const loadReferralStats = async (code: string) => {
    try {
      const response = await fetch(`https://api.nexus-alert.com/api/referrals/${code}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load referral stats:', err);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const shareTwitter = () => {
    const tweetText = encodeURIComponent(
      `I found my NEXUS appointment in 3 days with @NexusAlert 🎉 ${referralUrl}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  };

  const shareEmail = () => {
    const subject = encodeURIComponent('Check out NEXUS Alert!');
    const body = encodeURIComponent(
      `Hey! Are you still waiting for a NEXUS appointment?\n\nI've been using this Chrome extension that alerts me instantly when slots open up - it's way better than refreshing manually.\n\nCheck it out: ${referralUrl}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const redditTemplate = `I use NEXUS Alert [${referralUrl}] - got my appointment in under a week. Totally worth it for the instant notifications.`;

  if (!email) {
    return null;
  }

  return (
    <>
      {/* Floating Referral Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-semibold z-50"
      >
        <span className="text-xl">🎁</span>
        Earn Free Months
      </button>

      {/* Referral Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Refer Friends, Earn Free Months</h2>
                <p className="text-gray-400">Share NEXUS Alert and get rewarded!</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Stats */}
            {stats && (stats.clicks > 0 || stats.conversions > 0) && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-400">{stats.clicks || 0}</div>
                  <div className="text-sm text-gray-400 mt-1">Clicks</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-400">{stats.conversions || 0}</div>
                  <div className="text-sm text-gray-400 mt-1">Conversions</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-purple-400">{stats.conversions || 0}</div>
                  <div className="text-sm text-gray-400 mt-1">Free Months</div>
                </div>
              </div>
            )}

            {/* How it Works */}
            <div className="bg-[#141414] border border-[#222] rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Share your unique link</p>
                    <p className="text-gray-400 text-sm">Send it to friends, post on Reddit, tweet it</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">They sign up and upgrade</p>
                    <p className="text-gray-400 text-sm">When they become Premium subscribers</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">You both get 1 free month!</p>
                    <p className="text-gray-400 text-sm">No limit - refer unlimited friends</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Link */}
            <div className="bg-[#141414] border border-[#222] rounded-lg p-6 mb-6">
              <label className="text-sm text-gray-400 mb-2 block">Your Referral Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralUrl}
                  className="flex-1 bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white font-mono text-sm"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  onClick={copyToClipboard}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={shareTwitter}
                className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                Twitter
              </button>
              <button
                onClick={shareEmail}
                className="bg-[#6366f1] hover:bg-[#5558dd] text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </button>
            </div>

            {/* Pre-written Messages */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                💡 Copy-Paste Templates
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-2">For Reddit (r/NEXUS, r/Blaine, r/GlobalEntry)</div>
                  <div className="bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-sm text-gray-300 font-mono">
                    {redditTemplate}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-400 mb-2">For Slack/Discord/WhatsApp</div>
                  <div className="bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-sm text-gray-300 font-mono">
                    Check this out if you need a NEXUS appointment - got mine in 3 days: {referralUrl}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
