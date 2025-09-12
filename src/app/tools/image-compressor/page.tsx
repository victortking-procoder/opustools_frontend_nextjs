// src/app/tools/image-compressor/page.tsx
import { Metadata } from 'next';
import ImageCompressorClient from './ImageCompressorClient'; // Import the new client component

export async function generateMetadata(): Promise<Metadata> {
  const title = "Compress Image to 50kb - Free Online Image Compressor";
  const description = "Need to compress an image to 50kb? Our free tool also helps you compress image to 20kb or compress JPEG files to 100kb and 200kb, all while maintaining the best possible quality.";
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