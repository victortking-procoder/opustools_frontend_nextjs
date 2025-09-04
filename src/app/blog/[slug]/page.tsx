// src/app/blog/[slug]/page.tsx
import api from '@/lib/api';
import styles from '../BlogStyles.module.css';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import parse from 'html-react-parser';

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

// Fetch a single post by slug
async function getPost(slug: string): Promise<Post> {
  try {
    const response = await api.get(`/blog/posts/${slug}/`);
    return response.data;
  } catch (error) {
    notFound();
  }
}

// Generate SEO metadata for each post
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
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

// Helper to make CKEditor images responsive
function renderPostContent(html: string) {
  return parse(html, {
    replace: (domNode: any) => {
      if (domNode?.name === 'img' && domNode.attribs?.src) {
        // Ensure absolute URL if needed (optional)
        const src = domNode.attribs.src;
        domNode.attribs.style = (domNode.attribs.style || '') + 'max-width:100%;height:auto;margin:1rem 0;';
        return domNode;
      }
    },
  });
}

// Main page component
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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

        {/* Cover Image */}
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

        {/* Post Content with responsive images */}
        <div className={styles.postContent}>
          {renderPostContent(post.content)}
        </div>
      </article>
    </div>
  );
}