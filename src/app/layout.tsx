// src/app/layout.tsx
import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { Suspense } from 'react';

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "OpusTools | Free & Secure Online File Conversion Tools",
    template: "%s | OpusTools",
  },
  description: "A complete suite of free online tools to compress, convert, and edit your images and PDF documents securely and efficiently.",
  manifest: "/manifest.json",
  appleWebApp: {
    title: 'OpusTools',
    statusBarStyle: 'default',
  },
  metadataBase: new URL("https://opustools.xyz"),

  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "OpusTools | Free & Secure Online File Conversion Tools",
    description: "A complete suite of free online tools to compress, convert, and edit your images and PDF documents.",
    url: "https://opustools.xyz",
    siteName: "OpusTools",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpusTools | Free & Secure Online File Conversion Tools",
    description: "A complete suite of free online tools to compress, convert, and edit your images and PDF documents.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "OpusTools",
    "url": "https://opustools.xyz",
    "logo": "https://opustools.xyz/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@opustools.xyz",
      "contactType": "Customer Support"
    }
  };

  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          {process.env.NODE_ENV === "production" && (
            <GoogleAnalytics />
          )}
        </Suspense>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <div className="background-gradient" />
        <AuthProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
            <Header />
            <main style={{ flex: 1, containerType: 'inline-size' }}>
              <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}