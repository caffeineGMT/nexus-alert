import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nexus-alert.com'),
  title: 'NEXUS Alert — Never Miss an Appointment Slot',
  description:
    'Free Chrome extension that monitors NEXUS, Global Entry, and SENTRI appointment slots and notifies you the instant one opens up.',
  openGraph: {
    title: 'NEXUS Alert — Never Miss an Appointment Slot',
    description:
      'Free Chrome extension that monitors NEXUS, Global Entry, and SENTRI appointment slots.',
    url: 'https://nexus-alert.com',
    siteName: 'NEXUS Alert',
    // TODO: replace with a properly designed OG image (see web/public/og-image.png)
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NEXUS Alert' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEXUS Alert — Never Miss an Appointment Slot',
    description:
      'Free Chrome extension for NEXUS, Global Entry, and SENTRI appointment monitoring.',
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
