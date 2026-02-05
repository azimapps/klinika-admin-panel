import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: 'https://klinika-production.up.railway.app/', withCredentials: true });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('jwt_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // console.log('Request:', config.method?.toUpperCase(), config.baseURL, config.url, config.data);
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: (id: string) => `users/${id}`,
    signInPhone: '/admin/login/request',
    verifyPhone: '/admin/login/verify',
    signIn: 'users/login',
    signUp: '/api/auth/sign-up',
    request: '/admin/login/request',
    verify: '/admin/login/verify',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  category: {
    list: '/admin/categories/',
    details: (id: string) => `/admin/categories/${id}`,
    avatar: (id: string) => `/admin/categories/${id}/avatar`,
  },
  doctor: {
    list: '/admin/doctors/',
    details: (id: string) => `/admin/doctors/${id}`,
    avatar: (id: string) => `/admin/doctors/${id}/avatar`,
  },
  advantage: {
    list: '/advantages', // Public endpoint for listing
    create: '/admin/advantages', // Admin endpoint for creation
    details: (id: string) => `/admin/advantages/${id}`,
    image: (id: string) => `/admin/advantages/${id}/image`,
  },
  founder: {
    list: '/founders', // Public endpoint
    create: '/admin/founders', // Admin creation
    details: (id: string) => `/admin/founders/${id}`,
    avatar: (id: string) => `/admin/founders/${id}/avatar`,
  },
};
