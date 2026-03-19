import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";

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
  const crispWebsiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
  const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

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

        {/* Facebook Pixel */}
        {fbPixelId && fbPixelId !== 'your-fb-pixel-id-here' && (
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${fbPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
        {fbPixelId && fbPixelId !== 'your-fb-pixel-id-here' && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}

        {/* Google Ads Conversion Tracking */}
        {googleAdsId && googleAdsId !== 'your-google-ads-id-here' && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-ads" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAdsId}');
              `}
            </Script>
          </>
        )}

        {/* Plausible Analytics */}
        <Script
          defer
          data-domain="nexus-alert.com"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />

        {/* Crisp Live Chat Widget */}
        {crispWebsiteId && crispWebsiteId !== 'your-crisp-website-id-here' && (
          <Script id="crisp-chat" strategy="lazyOnload">
            {`
              window.$crisp=[];
              window.CRISP_WEBSITE_ID="${crispWebsiteId}";
              (function(){
                var d=document;
                var s=d.createElement("script");
                s.src="https://client.crisp.chat/l.js";
                s.async=1;
                d.getElementsByTagName("head")[0].appendChild(s);
              })();
              // Hide on /help routes — check once after Crisp loads
              window.CRISP_READY_TRIGGER = function() {
                if (window.location.pathname.indexOf('/help') !== -1) {
                  window.$crisp.push(['do', 'chat:hide']);
                }
              };
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
