import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nexus-alert.com'),
  title: 'NEXUS Alert - Get Notified of Appointment Slots Instantly | Chrome Extension',
  description:
    'Free Chrome extension that monitors NEXUS, Global Entry, and SENTRI appointment slots and notifies you the instant one opens up. Book your interview weeks sooner.',
  openGraph: {
    title: 'NEXUS Alert - Get Notified of Appointment Slots Instantly',
    description:
      'Free Chrome extension that monitors NEXUS, Global Entry, and SENTRI appointment slots and notifies you instantly.',
    url: 'https://nexus-alert.com',
    siteName: 'NEXUS Alert',
    // TODO: replace with a properly designed OG image (see web/public/og-image.png)
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NEXUS Alert' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEXUS Alert - Get Notified of Appointment Slots Instantly',
    description:
      'Free Chrome extension that monitors NEXUS, Global Entry, and SENTRI appointment slots. Book weeks sooner.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://nexus-alert.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
