// src/app/tools/image-resizer/page.tsx
import { Metadata } from 'next';
import ImageResizerClient from './ImageResizerClient'; // Import the new client component

export async function generateMetadata(): Promise<Metadata> {
  const title = "Free Online Image Resizer - Resize Photos by Width & Height Instantly";
  const description = "Resize images online for free with our fast and easy Image Resizer. Adjust width or height, maintain aspect ratio, and optimize photos for web, social media, or e-commerce in seconds.";
  const url = "/tools/image-resizer";

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
    },
    twitter: {
      title,
      description,
    },
  };
}

export default function ImageResizerPage() {
  return <ImageResizerClient />;
}