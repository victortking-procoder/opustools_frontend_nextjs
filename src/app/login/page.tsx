// src/app/login/page.tsx
'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import styles from '../auth.module.css';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState(''); // Can be username or email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login/', {
        username: identifier, // Your backend uses 'username' for both
        password: password,
      });

      const { user, token } = response.data;
      
      // Store the token and set the user
      localStorage.setItem('authToken', token);
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
      setUser(user);
      
      router.push('/'); // Redirect to homepage on success
      
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.non_field_errors?.join(', ') || 'Login failed. Please check your credentials.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Welcome Back</h1>

        {error && <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="identifier" className={styles.label}>
              Email or Username
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              required
              className={styles.input}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div style={{ textAlign: 'right' }}>
            <Link href="/password-reset" className={styles.redirectLink} style={{ fontSize: '0.875rem' }}>
              Forgot Password?
            </Link>
          </div>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className={styles.redirectText}>
          Don&apos;t have an account?{' '}
          <Link href="/register" className={styles.redirectLink}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;