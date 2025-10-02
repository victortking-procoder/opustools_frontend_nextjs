// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import api from '@/lib/api'
import { getSlugs } from '@/lib/dynamic-utils'; // ✅ IMPORT THE FUNCTION

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://opustools.xyz';

  // Existing static tool URLs
  const toolUrls = [
    '/tools/image-compressor',
    '/tools/image-resizer',
    '/tools/image-converter',
    '/tools/pdf-merger',
    '/tools/pdf-splitter',
    '/tools/pdf-compressor',
    '/tools/pdf-converter',
  ];

  // Map static tool URLs
  const toolEntries: MetadataRoute.Sitemap = toolUrls.map(url => ({
    url: `${baseUrl}${url}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // 🚀 NEW LOGIC: Generate entries for the 21 dynamic programmatic SEO pages
  const dynamicSlugs = getSlugs();

  const dynamicResizerEntries: MetadataRoute.Sitemap = dynamicSlugs.map(item => ({
    url: `${baseUrl}/tools/image-resizer/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly', // These pages are new and frequently updated
    priority: 0.85, // Slightly higher priority to indicate high value
  }));

  // Existing blog fetching logic
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const response = await api.get('/blog/posts/');
    const posts = response.data.results;

    blogEntries = posts.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.created_at),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Failed to fetch posts for sitemap:', error);
  }

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
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...toolEntries,
    ...dynamicResizerEntries, // <-- ALL 21 NEW PAGES ARE INCLUDED HERE
    ...blogEntries,
  ];
}