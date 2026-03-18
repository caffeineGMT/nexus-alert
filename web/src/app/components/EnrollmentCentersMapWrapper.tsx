'use client';

import dynamic from 'next/dynamic';

const EnrollmentCentersMap = dynamic(
  () => import('./EnrollmentCentersMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-[#111] border border-[#222] rounded-lg flex items-center justify-center">
        <p className="text-[#888]">Loading map...</p>
      </div>
    ),
  }
);

export default function EnrollmentCentersMapWrapper() {
  return <EnrollmentCentersMap />;
}
