// src/app/password-reset/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import api from '@/lib/api';
import styles from '../auth.module.css';
import Link from 'next/link';

export default function PasswordResetPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      // Call our new custom endpoint
      const response = await api.post('/auth/password-reset/', { email });
      setMessage(response.data.detail);
    } catch (err: any) {
      setError(err.response?.data?.email?.join(', ') || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Reset Your Password</h1>
        <p style={{ textAlign: 'center', color: '#9ca3af', marginBottom: '1.5rem' }}>
          Enter your email address and we will send you a link to reset your password.
        </p>

        {message && <p style={{ color: '#6ee7b7', textAlign: 'center', marginBottom: '1rem' }}>{message}</p>}
        {error && <p style={{ color: '#fca5a5', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

        {!message && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
         <p className={styles.redirectText}>
          Remembered your password?{' '}
          <Link href="/login" className={styles.redirectLink}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}