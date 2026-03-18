import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nexus-alert.com'),
  title: 'NEXUS Alert - Get Notified of Appointment Slots Instantly | Chrome Extension',
  description:
    'Automated appointment monitoring for NEXUS, Global Entry, and SENTRI. Get instant alerts when slots open.',
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
      <body className={`${geistSans.variable} antialiased`}>
        {children}
        {/* Crisp Live Chat Widget */}
        <Script id="crisp-chat" strategy="lazyOnload">
          {`
            window.$crisp=[];
            window.CRISP_WEBSITE_ID="REPLACE_WITH_YOUR_CRISP_WEBSITE_ID";
            (function(){
              var d=document;
              var s=d.createElement("script");
              s.src="https://client.crisp.chat/l.js";
              s.async=1;
              d.getElementsByTagName("head")[0].appendChild(s);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
