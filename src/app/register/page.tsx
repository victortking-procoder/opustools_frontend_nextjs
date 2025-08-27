// src/app/register/page.tsx
'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import styles from '../auth.module.css';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState(''); // State for confirm password
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // --- New Validation Check ---
    if (password !== password2) {
      setError("Passwords do not match.");
      return;
    }
    // -------------------------

    setIsLoading(true);

    try {
      const response = await api.post('/auth/register/', {
        first_name: firstName,
        last_name: lastName,
        username,
        email,
        password,
        password2,
      });

      const { user, token } = response.data;
      localStorage.setItem('authToken', token);
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
      setUser(user);
      router.push('/'); // Redirect to homepage on successful registration
    } catch (err: any) {
      if (err.response && err.response.data) {
        // Combine all error messages into a single string
        const errorData = err.response.data;
        const errorMessages = Object.keys(errorData)
          .map(key => `${key}: ${errorData[key].join(', ')}`)
          .join(' ');
        setError(errorMessages || 'Registration failed. Please try again.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Create Your Account</h1>

        {/* --- Error Message Display --- */}
        {error && <p className={styles.errorMessage}>{error}</p>}
        {/* --------------------------- */}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.nameFields}>
            <div className={styles.inputGroup}>
              <label htmlFor="first_name" className={styles.label}>
                First Name
              </label>
              <input id="first_name" name="first_name" type="text" required
                className={styles.input} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="last_name" className={styles.label}>
                Last Name
              </label>
              <input id="last_name" name="last_name" type="text" required
                className={styles.input} value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input id="username" name="username" type="text" required
              className={styles.input} value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email address
            </label>
            <input id="email" name="email" type="email" required
              className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input id="password" name="password" type="password" required
              className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {/* --- New Confirm Password Field --- */}
          <div className={styles.inputGroup}>
            <label htmlFor="password2" className={styles.label}>
              Confirm Password
            </label>
            <input id="password2" name="password2" type="password" required
              className={styles.input} value={password2} onChange={(e) => setPassword2(e.target.value)} />
          </div>
          {/* -------------------------------- */}

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className={styles.redirectText}>
          Already have an account?{' '}
          <Link href="/login" className={styles.redirectLink}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;