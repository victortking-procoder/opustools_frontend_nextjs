// src/app/blog/[slug]/page.tsx
import api from '@/lib/api';
import styles from '../BlogStyles.module.css';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Define the shape of a single Post
interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  author_username: string;
  created_at: string;
  cover_image: string | null;
}

// This server-side function fetches a single post by its slug
async function getPost(slug: string): Promise<Post> {
  try {
    const response = await api.get(`/blog/posts/${slug}/`);
    return response.data;
  } catch (error) {
    notFound(); // Triggers a 404 page if the post isn't found
  }
}

// This function generates dynamic SEO metadata for each post
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params; // ✅ await params
  const post = await getPost(slug);
  const excerpt = post.content.replace(/<[^>]+>/g, '').slice(0, 150);

  return {
    title: post.title,
    description: excerpt,
    openGraph: {
      title: post.title,
      description: excerpt,
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

// The main page component (Server Component)
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // ✅ await params
  const post = await getPost(slug);

  const postDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      <Link
        href="/blog"
        style={{
          color: '#9ca3af',
          textDecoration: 'underline',
          marginBottom: '2rem',
          display: 'inline-block',
        }}
      >
        &larr; Back to all posts
      </Link>

      <article className={styles.postContainer}>
        <h1 className={styles.postDetailTitle}>{post.title}</h1>
        <p className={styles.postDetailMeta}>
          By {post.author_username} on {postDate}
        </p>

        {post.cover_image && (
          <Image
            src={post.cover_image}
            alt={post.title}
            width={800}
            height={450}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '0.5rem',
              marginBottom: '2rem',
            }}
            priority
          />
        )}

        <div
          className={styles.postContent}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}