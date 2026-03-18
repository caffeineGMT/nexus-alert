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
  const crispWebsiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
  const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

  return (
    <html lang="en" className="dark">
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

        {/* Crisp Live Chat Widget - Hidden on /help routes via CSS to reduce clutter */}
        {crispWebsiteId && crispWebsiteId !== 'your-crisp-website-id-here' && (
          <>
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
              `}
            </Script>
            <Script id="crisp-hide-on-help" strategy="lazyOnload">
              {`
                // Hide Crisp chat widget on /help routes to reduce clutter
                if (typeof window !== 'undefined') {
                  function toggleCrispOnHelp() {
                    const isHelpPage = window.location.pathname.includes('/help');
                    if (window.$crisp) {
                      if (isHelpPage) {
                        window.$crisp.push(['do', 'chat:hide']);
                      } else {
                        window.$crisp.push(['do', 'chat:show']);
                      }
                    }
                  }

                  // Run on initial load
                  toggleCrispOnHelp();

                  // Listen for route changes (Next.js)
                  const observer = new MutationObserver(toggleCrispOnHelp);
                  observer.observe(document.body, { childList: true, subtree: true });
                }
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
