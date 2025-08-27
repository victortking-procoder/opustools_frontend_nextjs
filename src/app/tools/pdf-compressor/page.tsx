// src/app/tools/pdf-compressor/page.tsx
import { Metadata } from 'next';
import PdfCompressorClient from './PdfCompressorClient'; // Import the new client component

export async function generateMetadata(): Promise<Metadata> {
  const title = "Free Online PDF Compressor - Reduce PDF File Size Without Losing Quality";
  const description = "Compress PDF files online for free. Reduce file size while keeping quality, making PDFs easier to email, upload, and share. Fast, secure, and no installation required.";
  const url = "/tools/pdf-compressor";

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

export default function PdfCompressorPage() {
  return <PdfCompressorClient />;
}