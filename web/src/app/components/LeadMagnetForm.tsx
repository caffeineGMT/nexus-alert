'use client';

import { useState, useEffect } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface LeadMagnetFormProps {
  title?: string;
  description?: string;
  ctaText?: string;
  leadMagnet: 'checklist' | 'guide' | 'tips';
}

const LEAD_MAGNETS = {
  checklist: {
    defaultTitle: 'Free NEXUS Appointment Checklist',
    defaultDescription: 'Download our complete PDF checklist with everything you need before booking your NEXUS interview.',
    defaultCTA: 'Download Free Checklist',
    fileName: 'nexus-appointment-checklist.pdf',
  },
  guide: {
    defaultTitle: 'Ultimate NEXUS Application Guide',
    defaultDescription: 'Step-by-step guide to applying for NEXUS, Global Entry, or SENTRI. Save hours of research.',
    defaultCTA: 'Get Free Guide',
    fileName: 'nexus-application-guide.pdf',
  },
  tips: {
    defaultTitle: '10 Pro Tips to Find Appointments Faster',
    defaultDescription: 'Insider tips from people who successfully booked their NEXUS appointments in under a week.',
    defaultCTA: 'Download Tips',
    fileName: 'appointment-finding-tips.pdf',
  },
};

export default function LeadMagnetForm({
  title,
  description,
  ctaText,
  leadMagnet,
}: LeadMagnetFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const magnet = LEAD_MAGNETS[leadMagnet];
  const displayTitle = title || magnet.defaultTitle;
  const displayDescription = description || magnet.defaultDescription;
  const displayCTA = ctaText || magnet.defaultCTA;

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => setStatus('idle'), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('https://api.nexus-alert.com/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          leadMagnet,
          source: 'blog',
        }),
      });

      if (!res.ok) throw new Error('Request failed');

      const data = await res.json();
      setStatus('success');
      setEmail('');

      // Automatically download the PDF
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }

      // Track in Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'lead_magnet_download', {
          lead_magnet_type: leadMagnet,
          source: 'blog',
        });
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="my-12 p-8 rounded-2xl border-2 border-[#3b82f6] bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e]">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#3b82f6] flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#ededed] mb-2">{displayTitle}</h3>
          <p className="text-[#888] text-sm leading-relaxed">{displayDescription}</p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {status === 'success' && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-[rgba(34,197,94,0.15)] border border-[#22c55e] text-[#22c55e] text-sm">
          ✓ Check your email! Your download link is on the way.
        </div>
      )}
      {status === 'error' && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-[rgba(239,68,68,0.15)] border border-[#ef4444] text-[#ef4444] text-sm">
          Something went wrong. Please try again.
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-4 py-3 rounded-xl bg-[#111] border border-[#333] text-[#ededed] placeholder-[#555] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition text-sm"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 rounded-xl bg-[#3b82f6] text-white font-semibold hover:bg-[#2563eb] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap text-sm"
        >
          {status === 'loading' ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              Sending...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {displayCTA}
            </>
          )}
        </button>
      </form>

      <p className="text-[#555] text-xs mt-3 text-center">
        No spam. Just the download link and occasional appointment tips.
      </p>
    </div>
  );
}
