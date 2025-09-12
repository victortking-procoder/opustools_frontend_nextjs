// src/app/tools/image-resizer/page.tsx
import { Metadata } from 'next';
import ImageResizerClient from './ImageResizerClient'; // Import the new client component

export async function generateMetadata(): Promise<Metadata> {
  const title = "Resize Image to 30kb";
  const description = "Use our free image resizer to resize image to 30kb, or use the image resizer in 50 kb. We make it easy to resize image 100kb or even resize image to 500kb for any requirement.";
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