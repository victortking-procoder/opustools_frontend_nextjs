// src/app/privacy/page.tsx
import styles from '../legal.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | OpusTools',
  description: 'Learn how OpusTools handles your data securely.',
  alternates: {
    canonical: 'https://opustools.xyz/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Privacy Policy</h1>
      <div className={styles.content}>
        <p>Last updated: August 23, 2025</p>

        <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
        <p>
          We do not collect personal information from anonymous users. For users who create an account, we collect a username, email address, and name. We do not share this information with third parties.
        </p>

        <h2 className={styles.sectionTitle}>2. Uploaded Files</h2>
        <p>
          Files you upload for processing are stored temporarily on our servers. All files are automatically and permanently deleted from our servers a few hours after processing. We do not access or view the content of your files.
        </p>

        <h2 className={styles.sectionTitle}>3. Cookies</h2>
        <p>
          We use session cookies to track usage for unauthenticated users and to maintain login sessions for authenticated users. These cookies are essential for the operation of the site and are not used for tracking purposes outside of our service.
        </p>

        <h2 className={styles.sectionTitle}>4. Changes to This Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
        </p>
      </div>
    </div>
  );
}