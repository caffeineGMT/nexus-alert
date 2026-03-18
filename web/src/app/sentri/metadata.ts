import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://nexus-alert.com'),
  title: 'SENTRI Appointment Alerts | Never Miss a Slot',
  description:
    'Automated SENTRI appointment monitoring for US-Mexico border crossings. Get instant notifications when interview slots open up. Free Chrome extension.',
  openGraph: {
    title: 'SENTRI Appointment Alerts | Never Miss a Slot',
    description:
      'Automated SENTRI appointment monitoring for US-Mexico border crossings. Get instant notifications when interview slots open up.',
    url: 'https://nexus-alert.com/sentri',
    siteName: 'NEXUS Alert',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SENTRI Appointment Alert Extension' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SENTRI Appointment Alerts | Never Miss a Slot',
    description:
      'Automated SENTRI appointment monitoring. Get instant notifications when slots open.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://nexus-alert.com/sentri',
  },
  keywords: [
    'sentri appointment',
    'sentri appointment alert',
    'sentri slot notification',
    'sentri interview reschedule',
    'trusted traveler program',
    'goes appointment',
    'us mexico border',
    'sentri enrollment center',
  ],
};
