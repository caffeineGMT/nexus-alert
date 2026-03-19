import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import CookieConsentBanner from "./components/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nexus-alert.com'),
  title: {
    default: 'NEXUS Appointment Tracker - Find Global Entry Slots Fast | Free Chrome Extension',
    template: '%s | NEXUS Alert',
  },
  description:
    'Free NEXUS appointment tracker & Global Entry slot finder. Automated 24/7 monitoring finds interview cancellations and sends instant alerts. Book appointments in days, not months.',
  keywords: [
    'NEXUS appointment tracker',
    'Global Entry slot finder',
    'NEXUS interview cancellation alert',
    'how to find NEXUS appointments',
    'SENTRI appointment monitoring',
    'automated appointment tracker',
    'trusted traveler program appointments',
    'GOES appointment slots',
  ],
  openGraph: {
    title: 'NEXUS Appointment Tracker - Find Global Entry Slots Fast',
    description:
      'Free Chrome extension that monitors NEXUS, Global Entry, and SENTRI appointment cancellations 24/7. Get instant alerts when slots open up.',
    url: 'https://nexus-alert.com',
    siteName: 'NEXUS Alert',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NEXUS Alert Appointment Tracker' }],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEXUS Appointment Tracker - Find Slots Fast',
    description:
      'Free Chrome extension that monitors NEXUS, Global Entry, and SENTRI appointment slots 24/7. Book weeks sooner with instant cancellation alerts.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://nexus-alert.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  category: 'technology',
};

// WebSite structured data for Google sitelinks search box
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NEXUS Alert',
  url: 'https://nexus-alert.com',
  description: 'Automated NEXUS appointment tracker and Global Entry slot finder Chrome extension.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://nexus-alert.com/blog?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ scrollBehavior: 'smooth' }}>
      <head>
        {/* DNS prefetch and preconnect for third-party origins — reduces LCP */}
        <link rel="dns-prefetch" href="https://plausible.io" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://client.crisp.chat" />
        <link rel="preconnect" href="https://plausible.io" crossOrigin="anonymous" />

        {/* WebSite structured data for Google sitelinks */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        {children}

        {/* Cookie Consent Banner - Analytics only load after user consent */}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
