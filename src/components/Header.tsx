// src/components/Header.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import styles from './Header.module.css';
import { useRouter } from 'next/navigation';

const imageTools = [
  { name: 'Image Compressor', href: '/tools/image-compressor' },
  { name: 'Image Resizer', href: '/tools/image-resizer' },
  { name: 'Image Converter', href: '/tools/image-converter' },
];

const pdfTools = [
  { name: 'PDF Merger', href: '/tools/pdf-merger' },
  { name: 'PDF Splitter', href: '/tools/pdf-splitter' },
  { name: 'PDF Compressor', href: '/tools/pdf-compressor' },
  { name: 'PDF Converter', href: '/tools/pdf-converter' },
];

// A reusable dropdown component
const Dropdown = ({ title, items }: { title: string, items: { name: string, href: string }[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.dropdownToggle}>
        {title}
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {items.map((item) => (
            <Link key={item.href} href={item.href} className={styles.dropdownLink} onClick={() => setIsOpen(false)}>
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const { user, setUser, isLoading } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout/');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('authToken');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setIsMobileMenuOpen(false); // Close mobile menu on logout
      router.push('/');
    }
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          OpusTools
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <div className={styles.navLinks}>
            <Link href="/blog" className={styles.signInLink}>Blog</Link>
            <Dropdown title="Image Tools" items={imageTools} />
            <Dropdown title="PDF Tools" items={pdfTools} />
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <Link href="/account" className={styles.signInLink}>
                      Welcome, {user.first_name || user.username}!
                    </Link>
                    <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className={styles.signInLink}>Sign In</Link>
                    <Link href="/register" className={styles.signUpButton}>Create Account</Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className={styles.menuButton} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          ☰
        </button>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
          <h3 style={{color: '#9ca3af', fontSize: '0.875rem', padding: '0.75rem', textTransform: 'uppercase'}}>Image Tools</h3>
          {imageTools.map(tool => <Link key={tool.href} href={tool.href} onClick={() => setIsMobileMenuOpen(false)}>{tool.name}</Link>)}
          
          <h3 style={{color: '#9ca3af', fontSize: '0.875rem', padding: '0.75rem', textTransform: 'uppercase', marginTop: '1rem'}}>PDF Tools</h3>
          {pdfTools.map(tool => <Link key={tool.href} href={tool.href} onClick={() => setIsMobileMenuOpen(false)}>{tool.name}</Link>)}

          <div style={{borderTop: '1px solid #2c2b4f', margin: '1rem 0'}}></div>
          
          {!isLoading && (
            <>
              {user ? (
                <>
                  <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>My Account</Link>
                  <button onClick={handleLogout} className={styles.logoutButton} style={{width: '100%', textAlign: 'left', padding: '0.75rem'}}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>Create Account</Link>
                </>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;