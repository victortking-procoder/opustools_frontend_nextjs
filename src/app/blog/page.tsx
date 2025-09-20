import type { Metadata } from 'next';
import BlogPageClient from './BlogPageClient';

export const metadata: Metadata = {
  title: 'OpusTools Blog | Tutorials & Updates',
  description: 'Guides, tutorials, and news from OpusTools.',
  alternates: {
    canonical: 'https://opustools.xyz/blog',
  },
};

export default function BlogPage() {
  return <BlogPageClient />;
}