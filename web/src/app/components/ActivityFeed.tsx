'use client';

import useSWR from 'swr';

interface Activity {
  type: 'slot_found' | 'premium_upgrade';
  name: string;
  location: string;
  timestamp: number;
}

interface ActivityResponse {
  activities: Activity[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ActivityFeed() {
  const { data, isLoading } = useSWR<ActivityResponse>(
    'https://api.nexus-alert.com/api/activity',
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const activities = data?.activities || [];

  function getTimeAgo(timestamp: number) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  }

  function getActivityMessage(activity: Activity) {
    if (activity.type === 'slot_found') {
      return (
        <>
          <span className="font-semibold text-[#ededed]">{activity.name}</span> from{' '}
          <span className="text-[#22c55e]">{activity.location}</span> found a NEXUS slot
        </>
      );
    } else {
      return (
        <>
          <span className="font-semibold text-[#ededed]">{activity.name}</span> from{' '}
          <span className="text-[#3b82f6]">{activity.location}</span> upgraded to Premium
        </>
      );
    }
  }

  function getActivityIcon(type: string) {
    if (type === 'slot_found') {
      return (
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
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className="w-4 h-4 text-[#3b82f6]"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      );
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-[#111] rounded-lg border border-[#222]" />
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold text-center mb-6 text-[#ededed]">
        Live Activity
      </h3>
      <div className="space-y-2">
        {activities.map((activity, idx) => (
          <div
            key={`${activity.timestamp}-${idx}`}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#111] border border-[#222] animate-fade-in"
            style={{
              animationDelay: `${idx * 50}ms`,
            }}
          >
            <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>
            <div className="flex-1 text-sm text-[#aaa]">
              {getActivityMessage(activity)}
            </div>
            <div className="flex-shrink-0 text-xs text-[#555]">
              {getTimeAgo(activity.timestamp)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
