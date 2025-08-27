// src/app/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './HomePage.module.css';

const imageTools = [
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Reduce JPG, PNG, and GIF file sizes while maintaining quality.',
    href: '/tools/image-compressor'
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images by defining custom pixel dimensions.',
    href: '/tools/image-resizer'
  },
  {
    id: 'image-converter',
    name: 'Image Converter',
    description: 'Convert images to and from JPG, PNG, WEBP, and more.',
    href: '/tools/image-converter'
  },
];

const pdfTools = [
  {
    id: 'pdf-merger',
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into a single document.',
    href: '/tools/pdf-merger'
  },
  {
    id: 'pdf-splitter',
    name: 'Split PDF',
    description: 'Extract specific pages or page ranges from a PDF.',
    href: '/tools/pdf-splitter'
  },
   {
    id: 'pdf-compressor',
    name: 'Compress PDF',
    description: 'Reduce the file size of your PDF documents.',
    href: '/tools/pdf-compressor'
  },
  {
    id: 'pdf-converter',
    name: 'PDF Converter',
    description: 'Convert PDFs to Word, PowerPoint, Excel, and JPG.',
    href: '/tools/pdf-converter'
  },
];

const faqs = [
  {
    question: 'Is OpusTools free to use?',
    answer: 'Yes, all tools on our platform are free for a limited number of uses per day for anonymous users. For unlimited access and more features, you can sign up for a free account.'
  },
  {
    question: 'Are my uploaded files secure?',
    answer: 'Absolutely. We prioritize your privacy and security. All uploaded files are processed on our secure servers and are automatically deleted after a few hours. We do not access, share, or store your files long-term.'
  },
  {
    question: 'Do I need to install any software?',
    answer: 'No, OpusTools is a fully browser-based platform. All tools work directly on our website, so you don\'t need to download or install anything on your computer.'
  },
  {
    question: 'What file formats do you support?',
    answer: 'We support a wide range of popular formats for images (JPG, PNG, WEBP, GIF, etc.) and documents (PDF). Each tool\'s page provides specific details on its supported formats.'
  }
];

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleFaqToggle = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.headline}>Free Online PDF & Image Tools - Compress, Convert, and Edit Files</h1>
        <p className={styles.tagline}>
          Use OpusTools to quickly compress images, resize pictures, merge PDFs, split PDF pages, and convert files to JPG, PNG, Word, Excel, and more — all online, secure, and free.
        </p>
      </section>

      {/* How It Works Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.grid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.cardTitle}>Choose a Tool</h3>
            <p className={styles.cardDescription}>Select the right tool for your task from our comprehensive collection.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.cardTitle}>Upload Your File(s)</h3>
            <p className={styles.cardDescription}>Drag and drop your files securely into the browser. We respect your privacy.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.cardTitle}>Process & Download</h3>
            <p className={styles.cardDescription}>Adjust your settings, process the file, and download the result in seconds.</p>
          </div>
        </div>
      </section>

      {/* Image Tools Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Image Tools</h2>
        <div className={styles.grid}>
          {imageTools.map((tool) => (
            <Link href={tool.href} key={tool.id} className={styles.toolCard}>
              <h3 className={styles.toolName}>{tool.name}</h3>
              <p className={styles.toolDescription}>{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* PDF Tools Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>PDF Tools</h2>
        <div className={styles.grid}>
          {pdfTools.map((tool) => (
            <Link href={tool.href} key={tool.id} className={styles.toolCard}>
              <h3 className={styles.toolName}>{tool.name}</h3>
              <p className={styles.toolDescription}>{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* --- Updated FAQ Section --- */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        <div className={styles.faqContainer}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <button className={styles.faqQuestion} onClick={() => handleFaqToggle(index)}>
                <span>{faq.question}</span>
                <span className={styles.faqIcon} style={{ transform: openFaqIndex === index ? 'rotate(45deg)' : 'rotate(0)' }}>
                  +
                </span>
              </button>
              <p className={`${styles.faqAnswer} ${openFaqIndex === index ? styles.faqAnswerVisible : ''}`}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}