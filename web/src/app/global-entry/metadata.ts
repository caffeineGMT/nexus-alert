import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://nexus-alert.com'),
  title: 'Global Entry Appointment Alerts | Never Miss a Slot',
  description:
    'Automated Global Entry appointment monitoring. Get instant notifications when interview slots open up at your enrollment center. Free Chrome extension.',
  openGraph: {
    title: 'Global Entry Appointment Alerts | Never Miss a Slot',
    description:
      'Automated Global Entry appointment monitoring. Get instant notifications when interview slots open up at your enrollment center.',
    url: 'https://nexus-alert.com/global-entry',
    siteName: 'NEXUS Alert',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Global Entry Appointment Alert Extension' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Global Entry Appointment Alerts | Never Miss a Slot',
    description:
      'Automated Global Entry appointment monitoring. Get instant notifications when slots open.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://nexus-alert.com/global-entry',
  },
  keywords: [
    'global entry appointment',
    'global entry appointment finder',
    'global entry slot alert',
    'global entry interview reschedule',
    'trusted traveler program',
    'goes appointment',
    'global entry notification',
    'appointment monitor',
  ],
};
