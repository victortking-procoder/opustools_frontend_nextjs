'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import styles from './BlogStyles.module.css';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  author_username: string;
  cover_image: string | null;
}

interface PaginatedResponse {
  results: Post[];
  next: string | null;
  previous: string | null;
}

function createExcerpt(htmlContent: string, length = 150): string {
  if (!htmlContent) return '';
  const text = htmlContent.replace(/<[^>]+>/g, ''); // Strip HTML tags
  return text.length <= length ? text : text.slice(0, length) + '...';
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextPage, setNextPage] = useState<string | null>('/blog/posts/');
  const [loading, setLoading] = useState(false);

  const loadPosts = async (url: string) => {
    if (!url) return;
    setLoading(true);
    try {
      const response = await api.get<PaginatedResponse>(url);
      setPosts((prev) => [...prev, ...response.data.results]);
      setNextPage(response.data.next);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (nextPage) loadPosts(nextPage);
  }, []);

  return (
    <div>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>The OpusTools Blog</h1>
        <p className={styles.subtitle}>
          Tutorials, articles, and updates on our suite of free file processing tools.
        </p>
      </header>

      <main className={styles.postsGrid}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className={styles.postCard}>
              <div className={styles.thumbnailWrapper}>
                {post.cover_image ? (
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 250px"
                    className={styles.thumbnail}
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Image
                    src="/og-image.png"
                    alt="Default thumbnail"
                    fill
                    sizes="(max-width: 768px) 100vw, 250px"
                    className={styles.thumbnail}
                    style={{ objectFit: 'cover' }}
                  />
                )}
              </div>
              <div className={styles.cardContent}>
                <h2 className={styles.postTitle}>{post.title}</h2>
                <p className={styles.postExcerpt}>{createExcerpt(post.content)}</p>
                <p className={styles.authorInfo}>By Victor</p>
              </div>
            </Link>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </main>

      {nextPage && (
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <button
            onClick={() => loadPosts(nextPage)}
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}