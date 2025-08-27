// src/app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://opustools.xyz';

  const toolUrls = [
    '/tools/image-compressor',
    '/tools/image-resizer',
    '/tools/image-converter',
    '/tools/pdf-merger',
    '/tools/pdf-splitter',
    '/tools/pdf-compressor',
    '/tools/pdf-converter',
  ];

  const toolEntries: MetadataRoute.Sitemap = toolUrls.map(url => ({
    url: `${baseUrl}${url}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    ...toolEntries,
  ]
}