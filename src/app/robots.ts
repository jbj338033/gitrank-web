import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/my/', '/settings', '/auth/'],
    },
    sitemap: 'https://gitrank.kr/sitemap.xml',
  };
}
