// src/app/blog/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import styles from './Blog.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Tutorials, articles, and updates from the OpusTools team.',
};

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  author_username: string;
  thumbnail: string | null;
}

// This function fetches the data on the server
async function getPosts(): Promise<Post[]> {
  try {
    const response = await api.get('/blog/posts/', {
      // Use an internal, direct fetch on the server to avoid unnecessary HTTP requests
      baseURL: process.env.INTERNAL_API_URL || 'http://127.0.0.1:8000/api',
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

// A helper function to create a simple text excerpt
function createExcerpt(htmlContent: string, length = 150) {
  const text = htmlContent.replace(/<[^>]+>/g, ''); // Strip HTML tags
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>The OpusTools Blog</h1>
        <p className={styles.subtitle}>
          Tutorials, articles, and updates on our suite of free file processing tools.
        </p>
      </header>

      <main className={styles.postsGrid}>
        {posts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.id} className={styles.postCard}>
            <Image
              src={post.thumbnail || '/og-image.png'} // Use a fallback image
              alt={post.title}
              width={400}
              height={200}
              className={styles.thumbnail}
            />
            <div className={styles.cardContent}>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <p className={styles.postExcerpt}>{createExcerpt(post.content)}</p>
              <p className={styles.authorInfo}>By {post.author_username}</p>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}