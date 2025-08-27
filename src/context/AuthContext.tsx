// src/context/AuthContext.tsx
'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '@/lib/api';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await api.get('/auth/csrf/');
      } catch (error) {
        console.error('Failed to fetch CSRF token', error);
      }

      const token = localStorage.getItem('authToken');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Token ${token}`;
        try {
          const response = await api.get('/auth/user/');
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user', error);
          localStorage.removeItem('authToken');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};