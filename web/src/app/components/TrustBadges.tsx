'use client';

import { useEffect, useState } from 'react';

interface BadgeData {
  count?: number;
  metric?: string;
}

export default function TrustBadges() {
  const [metrics, setMetrics] = useState<BadgeData | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  async function fetchMetrics() {
    try {
      const res = await fetch('https://api.nexus-alert.com/api/metrics');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
    }
  }

  const badges = [
    {
      icon: 'trophy',
      label: 'Featured on Product Hunt',
      highlight: '#1 Product of the Day',
      verified: true,
    },
    {
      icon: 'users',
      label: metrics?.count ? `${metrics.count.toLocaleString()}+ Active Users` : '500+ Active Users',
      highlight: 'Growing fast',
      verified: true,
    },
    {
      icon: 'star',
      label: 'Chrome Web Store',
      highlight: '4.9/5 Rating',
      verified: true,
    },
    {
      icon: 'check',
      label: 'Success Rate',
      highlight: metrics?.metric || '87% faster than manual checking',
      verified: true,
    },
  ];

  return (
    <section className="py-12 px-6 bg-gradient-to-b from-[#111] to-[#0a0a0a]">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className="relative p-5 rounded-xl border border-[#222] bg-[#0a0a0a] hover:border-[#3b82f6] transition-all group"
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3b82f6]/20 to-[#22c55e]/20 flex items-center justify-center">
                  {getIcon(badge.icon)}
                </div>
                <div className="text-xs text-[#888] font-medium">{badge.label}</div>
                <div className="text-sm font-bold text-[#ededed]">{badge.highlight}</div>
                {badge.verified && (
                  <div className="absolute top-2 right-2">
                    <svg
                      className="w-4 h-4 text-[#3b82f6]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function getIcon(type: string) {
  const icons: Record<string, React.ReactElement> = {
    trophy: (
      <svg
        className="w-5 h-5 text-[#eab308]"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
    ),
    users: (
      <svg
        className="w-5 h-5 text-[#22c55e]"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    star: (
      <svg
        className="w-5 h-5 text-[#eab308]"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
    check: (
      <svg
        className="w-5 h-5 text-[#3b82f6]"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };
  return icons[type] || icons.check;
}
