// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import api from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // ✅ Use axios instance with baseURL = https://api.opustools.xyz/api
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const response = await api.get('/blog/posts/'); // → https://api.opustools.xyz/api/blog/posts/
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
    ...blogEntries,
  ];
}