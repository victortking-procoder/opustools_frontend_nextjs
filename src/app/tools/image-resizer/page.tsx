// src/app/tools/image-resizer/page.tsx
// This is the BASE page for the Image Resizer tool (URL: /tools/image-resizer)

import { Metadata } from 'next';
import ImageResizerClient from './ImageResizerClient'; 
// NOTE: Make sure the path to your styles is correct
import styles from '@/app/ImageTool.module.css';

// --- 1. Static Metadata for the Canonical Page ---
export const metadata: Metadata = {
  title: 'Free Online Image Resizer - Resize Images Instantly | OpusTools',
  description: 'Resize your images, photos, and pictures online for free. Adjust dimensions, compress file size, or convert units without losing quality. Fast, secure, and easy to use.',
  alternates: {
    canonical: '/tools/image-resizer',
  },
};


// --- 2. Static Content for the Canonical Page ---
const H1_TEXT = "Free Online Image Resizer Tool";
const INTRO_PARAGRAPH = "Quickly and easily resize any image file—JPG, PNG, WebP, and more—to the exact dimensions or file size you need. Our powerful tool is perfect for web uploads, social media, or printing requirements.";

// --- 3. Base Server Component Rendering ---
export default function ImageResizerBasePage() {

    // Define generic SEO content for the base page (similar structure to dynamic pages)
    const genericSeoContent = `
        <h2 class="${styles.seoTitle}">Why Choose OpusTools for Image Resizing?</h2>
        <p class="${styles.description}">
            Whether you're dealing with strict file limits or precise pixel requirements, our image resizer is built for reliability. We offer advanced features like unit conversion (inches, mm) and smart compression to deliver optimal results every time. Use the tool above to start resizing instantly!
        </p>

        <h3 class="${styles.seoSubtitle}">Key Features</h3>
        <ul>
            <li>**Pixel Precision:** Resize to exact widths and heights (e.g., 256x256, 1000x1000).</li>
            <li>**File Size Compression:** Shrink images to a target file size (e.g., 500KB, 2MB).</li>
            <li>**Unit Conversion:** Calculate correct dimensions for printing in inches or centimeters.</li>
            <li>**Quality Control:** Intelligent algorithms ensure minimal visual loss during resizing.</li>
        </ul>

        <h2 class="${styles.seoTitle}">Image Resizer Tool FAQ</h2>
        <div class="${styles.faqItem}">
            <h3 class="${styles.seoSubtitle}">Is this image resizer tool truly free?</h3>
            <p>Yes, OpusTools offers the core image resizing functionality completely free of charge. You can resize an unlimited number of images with basic options. A premium plan is available for unlimited high-volume or advanced API access.</p>
        </div>
        
        <div class="${styles.relatedLinks}">
          <h2>Other Popular OpusTools</h2>
          <p>Optimize your workflow with our suite of tools:</p>
          <ul>
            <li><a href="/tools/image-compressor">Image Compressor</a> - Reduce file size further.</li>
            <li><a href="/tools/image-converter">Image Converter</a> - Convert formats like PNG to JPG.</li>
          </ul>
        </div>
    `;

    // JSON-LD Structured Data for the base SoftwareApplication
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Image Resizer",
        "applicationCategory": "Multimedia",
        "operatingSystem": "Web",
        "url": "https://opustools.xyz/tools/image-resizer",
        "description": metadata.description,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "5000" 
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

            {/* Static H1 and Intro Paragraph (Server-rendered) */}
            <h1 className={styles.title}>{H1_TEXT}</h1>
            <p className={styles.description}>{INTRO_PARAGRAPH}</p>

            {/* Client Component for the Interactive Tool */}
            <ImageResizerClient />

            {/* Static SEO Depth Content */}
            <div 
                className={styles.seoContent} 
                dangerouslySetInnerHTML={{ __html: genericSeoContent }} 
            />
            
        </div>
    );
}