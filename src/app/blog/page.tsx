// src/app/blog/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import styles from './BlogStyles.module.css';
import { Metadata } from 'next';

// SEO Metadata for the main blog page
export const metadata: Metadata = {
  title: 'Blog',
  description: 'Tutorials, articles, and updates from the OpusTools team.',
};

// Define the shape of a Post object
interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  author_username: string;
  cover_image: string | null;
}

// Define the shape of the paginated API response
interface PaginatedResponse {
  results: Post[];
}

// This function fetches the list of posts on the server
async function getPosts(): Promise<Post[]> {
  try {
    const response = await api.get<PaginatedResponse>('/blog/posts/');
    return response.data.results || [];
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

// A helper function to create a simple text excerpt from HTML
function createExcerpt(htmlContent: string, length = 150): string {
  if (!htmlContent) return '';
  const text = htmlContent.replace(/<[^>]+>/g, ''); // Strip HTML tags
  return text.length <= length ? text : text.slice(0, length) + '...';
}

// The main page component (Server Component)
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
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link
              href={`/blog/${post.slug}`}
              key={post.id}
              className={styles.postCard}
            >
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
                    src="/og-image.png" // fallback
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
    </div>
  );
}