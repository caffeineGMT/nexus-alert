import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NEXUS Appointment Finder - Get Alerts for Open Slots | NEXUS Alert',
  description:
    'Monitor NEXUS appointment slots at US-Canada border locations. Get instant notifications when interview slots open. Free Chrome extension with smart alerts.',
  keywords: [
    'nexus appointment finder',
    'nexus appointment alert',
    'nexus appointment checker',
    'nexus slot finder',
    'nexus interview appointment',
    'US Canada border',
    'trusted traveler program',
    'nexus appointments',
  ],
  openGraph: {
    title: 'NEXUS Appointment Finder - Never Miss an Open Slot',
    description:
      'Free Chrome extension that monitors NEXUS appointment slots and alerts you instantly when slots open at US-Canada border locations.',
    url: 'https://nexus-alert.com/nexus',
    siteName: 'NEXUS Alert',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NEXUS Alert' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEXUS Appointment Finder - Get Instant Alerts',
    description:
      'Monitor NEXUS appointments 24/7. Get notified instantly when slots open. Book weeks sooner.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://nexus-alert.com/nexus',
  },
};
