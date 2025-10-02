// src/app/tools/image-resizer/[slug]/page.tsx

import { Metadata } from 'next';
import ImageResizerClient from '../ImageResizerClient'; 
import { getToolDataBySlug, getSlugs, getDepthContent } from '@/lib/dynamic-utils';
// NOTE: Make sure the path to your styles is correct.
import styles from '.../ImageTool.module.css'; 

// --- 1. Programmatic Static Generation ---
export async function generateStaticParams() {
  return getSlugs(); 
}

type Props = {
  params: { slug: string };
};

// --- 2. Dynamic Metadata Generation ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const toolData = getToolDataBySlug(params.slug);
  
  if (!toolData) return { title: "Page Not Found" };

  const { title, description } = toolData;
  const url = `/tools/image-resizer/${params.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: { title, description, url },
    twitter: { title, description },
  };
}

// --- 3. Server-Side Rendering (Content & JSON-LD) ---
export default function ImageResizerDynamicPage({ params }: Props) {
  const toolData = getToolDataBySlug(params.slug);
  
  if (!toolData) return <div>404 - Tool not found.</div>;
    
  const { h1Text, introParagraph, mainKeyword, description } = toolData;

  // Collect style classes for passing to the utility function (Fix for Error 2)
  const classNames = {
      seoTitle: styles.seoTitle,
      description: styles.description,
      seoSubtitle: styles.seoSubtitle,
      faqItem: styles.faqItem,
      relatedLinks: styles.relatedLinks,
  };

  // Generate the HTML for the deep SEO content
  const seoContentHtml = getDepthContent(mainKeyword, params.slug, classNames);

  // JSON-LD Structured Data
  const jsonLd = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": h1Text.replace('Free Online Tool to ', ''),
      "applicationCategory": "Multimedia",
      "operatingSystem": "Web",
      "url": `https://opustools.xyz/tools/image-resizer/${params.slug}`,
      "description": description,
      "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "2500" 
      },
      "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
      },
      "publisher": {
          "@type": "Organization",
          "name": "OpusTools",
          "url": "https://opustools.xyz"
      }
  };

  return (
    <div className={styles.toolContainer}>
        
        {/* JSON-LD Script */}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Dynamic H1 and Intro Paragraph (Server-rendered) */}
        <h1 className={styles.title}>{h1Text}</h1>
        <p className={styles.description}>{introParagraph}</p>

        {/* Client Component for the Interactive Tool */}
        <ImageResizerClient />

        {/* Dynamic SEO Depth Content (Server-rendered) */}
        <div 
            className={styles.seoContent} 
            dangerouslySetInnerHTML={{ __html: seoContentHtml }} 
        />
        
    </div>
  );
}