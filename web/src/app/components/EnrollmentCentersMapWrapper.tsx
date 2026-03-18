'use client';

import dynamic from 'next/dynamic';

const EnrollmentCentersMap = dynamic(
  () => import('./EnrollmentCentersMap'),
  { ssr: false }
);

export default function EnrollmentCentersMapWrapper() {
  return <EnrollmentCentersMap />;
}
