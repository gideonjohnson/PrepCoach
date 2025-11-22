import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/auth/reset-password',
          '/auth/verify-email',
          '/auth/forgot-password',
        ],
      },
    ],
    sitemap: 'https://aiprep.work/sitemap.xml',
  };
}
