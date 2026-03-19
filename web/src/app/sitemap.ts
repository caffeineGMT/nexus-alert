import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nexus-alert.com';
  const currentDate = new Date().toISOString();

  return [
    // Core pages
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/nexus`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/global-entry`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sentri`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: '2026-03-18',
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pro`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Blog
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog/how-to-get-nexus-appointment-fast`,
      lastModified: '2026-03-18',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/nexus-conditional-approval`,
      lastModified: '2026-03-18',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/nexus-interview-tips`,
      lastModified: '2026-03-18',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/global-entry-vs-nexus-vs-sentri`,
      lastModified: '2026-03-18',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/best-times-to-check-nexus-appointments`,
      lastModified: '2026-03-18',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/global-entry-appointment-tips`,
      lastModified: '2026-03-18',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/nexus-interview-locations`,
      lastModified: '2026-03-18',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/nexus-appointment-checklist`,
      lastModified: '2026-03-18',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/is-global-entry-worth-it`,
      lastModified: '2026-03-18',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/success-story-family-global-entry`,
      lastModified: '2026-03-18',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/success-story-sarah-nexus-3-days`,
      lastModified: '2026-03-18',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Legal & support
    {
      url: `${baseUrl}/privacy`,
      lastModified: '2026-03-18',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: '2026-03-18',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: '2026-03-18',
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
