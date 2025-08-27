// src/components/Footer.tsx
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>© 2025 OpusTools. All Rights Reserved.</p>
        <div className={styles.footerLinks}>
          <Link href="/terms" className={styles.footerLink}>
            Terms & Conditions
          </Link>
          <Link href="/privacy" className={styles.footerLink}>
            Privacy Policy
          </Link>
          <a href="mailto:support@opustools.xyz" className={styles.footerLink}>
            support@opustools.xyz
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;