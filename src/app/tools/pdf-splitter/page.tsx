// src/app/tools/pdf-splitter/page.tsx
import { Metadata } from 'next';
import PdfSplitterClient from './PdfSplitterClient'; // Import the new client component

export async function generateMetadata(): Promise<Metadata> {
  const title = "Free Online PDF Splitter - Extract Pages or Split PDF Files Easily";
  const description = "Split PDF files online for free. Extract specific pages or ranges into new PDFs. Fast, secure, and easy-to-use PDF splitter – no installation required.";
  const url = "/tools/pdf-splitter";

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

export default function PdfSplitterPage() {
  return <PdfSplitterClient />;
}