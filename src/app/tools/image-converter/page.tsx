// src/app/tools/image-converter/page.tsx
import { Metadata } from 'next';
import ImageConverterClient from './ImageConverterClient'; // Import the new client component

export async function generateMetadata(): Promise<Metadata> {
  const title = "Free Online Image Converter - Convert PNG, JPG, WEBP, GIF, BMP & TIFF";
  const description = "Easily convert images online for free. Change PNG to JPG, JPG to PNG, or convert to WEBP, GIF, BMP, and TIFF. Fast, secure, and optimized for web, social media, and e-commerce use.";
  const url = "/tools/image-converter";

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

export default function ImageConverterPage() {
  return <ImageConverterClient />;
}