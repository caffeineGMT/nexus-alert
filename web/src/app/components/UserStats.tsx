'use client';

import { useEffect, useState } from 'react';

export default function UserStats() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch('https://api.nexus-alert.com/api/stats');
      if (res.ok) {
        const data = await res.json();
        setTotalUsers(data.totalUsers || 0);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }

  if (totalUsers === null) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[#888]">
      <svg
        className="w-4 h-4 text-[#22c55e]"
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
      <span>
        Join{' '}
        <span className="font-semibold text-[#ededed]">
          {totalUsers.toLocaleString()}
        </span>{' '}
        {totalUsers === 1 ? 'person' : 'people'} monitoring appointments
      </span>
    </div>
  );
}
