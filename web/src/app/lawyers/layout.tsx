import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NEXUS Alert for Immigration Lawyers | Bulk Client Management',
  description:
    'Immigration law firms: Monitor hundreds of NEXUS, Global Entry, and SENTRI appointments for all your clients. Team pricing, bulk management, white-label options. Help clients book faster.',
  keywords:
    'immigration lawyer tools, NEXUS appointment tracker for lawyers, Global Entry bulk monitoring, immigration law practice management, client appointment tracking',
  openGraph: {
    title: 'NEXUS Alert for Immigration Lawyers | Bulk Client Management',
    description:
      'Immigration law firms: Monitor hundreds of NEXUS, Global Entry, and SENTRI appointments for all your clients. Team pricing, bulk management, white-label options.',
    type: 'website',
    url: 'https://nexus-alert.com/lawyers',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEXUS Alert for Immigration Lawyers',
    description:
      'Monitor hundreds of client appointments simultaneously. Team pricing for immigration law firms.',
  },
};

export default function LawyersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
