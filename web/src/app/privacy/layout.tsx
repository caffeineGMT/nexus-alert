import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - NEXUS Alert',
  description: 'Privacy policy for NEXUS Alert Chrome extension. Learn how we protect your data and what information we collect.',
  openGraph: {
    title: 'Privacy Policy - NEXUS Alert',
    description: 'Privacy policy for NEXUS Alert Chrome extension',
    type: 'website',
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
