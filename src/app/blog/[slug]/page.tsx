// src/app/blog/[slug]/page.tsx
import api from '@/lib/api';
import styles from './Post.module.css';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  author_username: string;
}

// This function generates the dynamic metadata for each post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  const excerpt = post.content.replace(/<[^>]+>/g, '').slice(0, 150);
  return {
    title: post.title,
    description: excerpt,
  };
}

// This function fetches a single post by its slug
async function getPost(slug: string): Promise<Post> {
  try {
    const response = await api.get(`/blog/posts/${slug}/`, {
      baseURL: process.env.INTERNAL_API_URL || 'http://127.0.0.1:8000/api',
    });
    return response.data;
  } catch (error) {
    notFound(); // This will render a 404 page if the post is not found
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  return (
    <article className={styles.postContainer}>
      <h1 className={styles.postTitle}>{post.title}</h1>
      <p className={styles.authorInfo}>By {post.author_username}</p>
      <div
        className={styles.postContent}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}