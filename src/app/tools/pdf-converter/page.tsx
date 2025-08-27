// src/app/tools/pdf-converter/page.tsx
import { Metadata } from 'next';
import PdfConverterClient from './PdfConverterClient'; // Import the new client component

export async function generateMetadata(): Promise<Metadata> {
  const title = "Free Online PDF Converter - Convert PDF to Word, Excel, PowerPoint & JPG";
  const description = "Convert PDF to Word, Excel, PowerPoint, or JPG online for free. Fast, secure, and easy-to-use PDF converter with no installation required.";
  const url = "/tools/pdf-converter";

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

export default function PdfConverterPage() {
  return <PdfConverterClient />;
}