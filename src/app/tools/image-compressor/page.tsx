// src/app/tools/image-compressor/page.tsx
import { Metadata } from 'next';
import ImageCompressorClient from './ImageCompressorClient'; // Import the new client component

export async function generateMetadata(): Promise<Metadata> {
  const title = "Free Online Image Compressor - Reduce JPG, PNG & WebP File Size";
  const description = "Compress images online for free without losing quality. Optimize JPG, PNG, and WebP files for faster websites, better SEO, and reduced storage with our Image Compressor.";
  const url = "/tools/image-compressor";

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

export default function ImageCompressorPage() {
  return <ImageCompressorClient />;
}