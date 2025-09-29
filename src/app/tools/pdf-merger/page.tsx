// src/app/tools/pdf-merger/page.tsx
import { Metadata } from 'next';
import PdfMergerClient from './PdfMergerClient'; // Import the new client component

export async function generateMetadata(): Promise<Metadata> {
  const title = "Free PDF Merger - Combine Multiple PDFs Online";
  const description = "Merge PDF files online for free. Arrange and combine multiple PDFs into one document. Fast, secure, and easy-to-use PDF merger – no installation required.";
  const url = "/tools/pdf-merger";

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

export default function PdfMergerPage() {
  return <PdfMergerClient />;
}