import api from '@/lib/api';
import styles from '../BlogStyles.module.css';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import parse from 'html-react-parser';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  author_username: string;
  created_at: string;
  cover_image: string | null;
}

async function getPost(slug: string): Promise<Post> {
  try {
    const response = await api.get(`/blog/posts/${slug}/`);
    return response.data;
  } catch {
    notFound();
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const post = await getPost(slug);
  const excerpt = post.content.replace(/<[^>]+>/g, '').slice(0, 150);

  return {
    title: post.title,
    description: excerpt,
    alternates: {
      canonical: `https://opustools.xyz/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: excerpt,
      url: `https://opustools.xyz/blog/${post.slug}`,
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

function renderPostContent(html: string) {
  return parse(html, {
    replace: (domNode: any) => {
      if (domNode?.name === 'img' && domNode.attribs?.src) {
        domNode.attribs.style = (domNode.attribs.style || '') + 'max-width:100%;height:auto;margin:1rem 0;';
        domNode.attribs.loading = 'lazy';
        return domNode;
      }
    },
  });
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await getPost(slug);

  const postDate = new Date(post.created_at).toISOString(); // ISO for schema
  const postDateReadable = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // ✅ JSON-LD structured data for single post
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.cover_image ? [post.cover_image] : ['https://opustools.xyz/og-image.png'],
    datePublished: postDate,
    author: {
      '@type': 'Person',
      name: 'Victor',
    },
    publisher: {
      '@type': 'Organization',
      name: 'OpusTools',
      logo: {
        '@type': 'ImageObject',
        url: 'https://opustools.xyz/logo.png',
      },
    },
    description: post.content.replace(/<[^>]+>/g, '').slice(0, 150),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://opustools.xyz/blog/${post.slug}`,
    },
  };

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
          By 'Victor' on {postDateReadable}
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

        <div className={styles.postContent}>
          {renderPostContent(post.content)}
        </div>
      </article>

      {/* ✅ Inject JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(articleJsonLd)}
      </script>
    </div>
  );
}