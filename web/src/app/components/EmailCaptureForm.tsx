'use client';

import { useState, useEffect } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function EmailCaptureForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => setStatus('idle'), 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('https://api.nexus-alert.com/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          program: 'NEXUS',
          locations: [],
          dateRange: {},
          timeRange: {},
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="mt-8">
      {/* Toast — above the form */}
      {(status === 'success' || status === 'error') && (
        <div
          className={`animate-fade-in mb-4 mx-auto max-w-sm px-4 py-2.5 rounded-lg text-xs text-center border ${
            status === 'success'
              ? 'bg-[rgba(34,197,94,0.15)] border-[#22c55e] text-[#22c55e]'
              : 'bg-[rgba(239,68,68,0.15)] border-[#ef4444] text-[#ef4444]'
          }`}
        >
          {status === 'success'
            ? '✓ You\'re on the list!'
            : 'Something went wrong — try again'}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-[#111] border border-[#333] text-sm text-[#ededed] placeholder-[#555] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-2.5 rounded-xl bg-[#3b82f6] text-white text-sm font-semibold hover:bg-[#2563eb] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
        >
          {status === 'loading' ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              Subscribing…
            </>
          ) : (
            'Get Early Access'
          )}
        </button>
      </form>
    </div>
  );
}
