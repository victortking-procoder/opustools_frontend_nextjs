// src/app/terms/page.tsx
import styles from '../legal.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | OpusTools',
  description: 'Read the Terms of Service for using OpusTools.',
  alternates: {
    canonical: 'https://opustools.xyz/terms',
  },
};

export default function TermsPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Terms of Service</h1>
      <div className={styles.content}>
        <p>Last updated: August 23, 2025</p>

        <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
        <p>
          By accessing and using OpusTools ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
        </p>

        <h2 className={styles.sectionTitle}>2. Service Description</h2>
        <p>
          OpusTools provides users with a collection of online tools for file conversion, compression, and editing. You understand and agree that the Service is provided "as-is" and that we assume no responsibility for the timeliness, deletion, or failure to store any user communications or personalization settings.
        </p>

        <h2 className={styles.sectionTitle}>3. User Conduct</h2>
        <p>
          You are solely responsible for all content that you upload, process, or download through the Service. You agree not to use the Service to process any material that is unlawful, harmful, or infringes on the intellectual property rights of others.
        </p>

        <h2 className={styles.sectionTitle}>4. Limitation of Liability</h2>
        <p>
          In no event shall OpusTools be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or the inability to use the service.
        </p>
      </div>
    </div>
  );
}