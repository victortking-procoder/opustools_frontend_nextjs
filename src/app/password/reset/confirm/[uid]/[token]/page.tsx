// src/app/password/reset/confirm/[uid]/[token]/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import styles from '../../../../../auth.module.css'; // Adjust path to the shared auth styles

export default function PasswordResetConfirmPage() {
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== reNewPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setIsLoading(true);

    const { uid, token } = params;

    try {
      // Call our new custom endpoint
      const response = await api.post('/auth/password-reset-confirm/', {
        uid,
        token,
        new_password: newPassword,
      });
      setMessage(response.data.detail + ' Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred. The reset link may be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Enter New Password</h1>
        
        {message && <p style={{ color: '#6ee7b7', textAlign: 'center', marginBottom: '1rem' }}>{message}</p>}
        {error && <p style={{ color: '#fca5a5', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

        {!message && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="new_password" className={styles.label}>
                New Password
              </label>
              <input
                id="new_password"
                type="password"
                required
                className={styles.input}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="re_new_password" className={styles.label}>
                Confirm New Password
              </label>
              <input
                id="re_new_password"
                type="password"
                required
                className={styles.input}
                value={reNewPassword}
                onChange={(e) => setReNewPassword(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}