import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // Use basePath only for GitHub Pages preview (not for Vercel production)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
    {
      source: '/(.*)\\.(js|css|png|jpg|jpeg|webp|svg|ico|woff|woff2)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
  ],
};

export default withSentryConfig(withNextIntl(nextConfig), {
  // Sentry webpack plugin options
  silent: true,
  org: "nexus-alert",
  project: "web",

  // Upload source maps during build
  widenClientFileUpload: true,

  // Hide source maps from generated client bundles
  hideSourceMaps: true,

  // Tree-shake Sentry logger and enable Vercel monitors via webpack config
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
    automaticVercelMonitors: true,
  },
});

