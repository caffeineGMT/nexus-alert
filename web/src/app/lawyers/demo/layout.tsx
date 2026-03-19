import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Schedule a Demo | NEXUS Alert for Immigration Lawyers',
  description:
    'Book a personalized demo of NEXUS Alert for your immigration law practice. See bulk client management, white-label options, and ROI calculator in action.',
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
