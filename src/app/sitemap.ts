import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const BASE_URL = 'https://leon.dev'; // Update when domain is purchased

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: new Date(), priority: 1.0 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), priority: 0.6 },
  ];
}
