import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/exit-survey/', '/success/', '/submit-testimonial/', '/ph/'],
      },
    ],
    sitemap: 'https://nexus-alert.com/sitemap.xml',
  };
}
