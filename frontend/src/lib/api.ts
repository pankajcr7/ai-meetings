import axios from 'axios';

// HARDCODED: Change this to your deployed backend URL when you deploy the backend
// Then update this URL and redeploy the frontend
export const API_BASE_URL = 'https://ai-meetings-backend.onrender.com';
export const API_URL = `${API_BASE_URL}/api`;

// Use environment variable if available (for local dev)
// export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const requestUrl = error.config?.url || '';
      const currentPath = window.location.pathname;
      const isAuthCheck = requestUrl.includes('/auth/me');
      const isPublicPage = ['/', '/login', '/signup'].includes(currentPath);

      // Don't redirect for /auth/me (AuthContext handles it) or if already on a public page
      if (!isAuthCheck && !isPublicPage) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
