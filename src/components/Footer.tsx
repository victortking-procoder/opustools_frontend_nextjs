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
        <p>Featured.</p>
        <div className={styles.footerLink}>
          <a href="https://twelve.tools" target="_blank"><img src="https://twelve.tools/badge0-dark.svg" alt="Featured on Twelve Tools" width="200" height="54"></a>
          <a href="https://startupfa.me/s/opustools?utm_source=opustools.xyz" target="_blank"><img src="https://startupfa.me/badges/featured-badge.webp" alt="Featured on Startup Fame" width="171" height="54" /></a>
          <a href="https://fazier.com" target="_blank"><img src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=featured&theme=dark" width="250" alt="Fazier badge" /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;