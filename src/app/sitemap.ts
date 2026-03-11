import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const BASE_URL = 'https://leon.dev'; // Update when domain is purchased

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: new Date(), priority: 1.0 },
  ];
}
