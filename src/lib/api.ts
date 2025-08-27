// src/lib/api.ts
import axios from 'axios';
import { getCookie } from './utils';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const csrfToken = getCookie('csrftoken');
  if (csrfToken && ['POST', 'PATCH', 'PUT', 'DELETE'].includes(config.method?.toUpperCase() || '')) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

export default api;