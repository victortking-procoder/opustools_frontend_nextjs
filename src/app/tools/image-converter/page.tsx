// src/app/tools/image-converter/page.tsx
import { Metadata } from 'next';
import ImageConverterClient from './ImageConverterClient'; // Import the new client component

export async function generateMetadata(): Promise<Metadata> {
  const title = "Convert Image to JPG 20kb - Free Image Converter";
  const description = "Need an image to jpg converter 20kb? Our tool can convert your images to JPG, PNG, WEBP, and more, while helping you meet specific size requirements. We also handle large formats, acting as a 3000x3000 image converter, and specialized conversions like tiff to jpg.";
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