import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

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
    signIn: 'users/login',
    signUp: '/api/auth/sign-up',
    request: '/admin/login/request',
    verify: '/admin/login/verify',
  },
  // HOMEMED staff auth (username + password)
  staff: {
    login: '/staff/auth/login',
    me: '/staff/auth/me',
    changePassword: '/staff/auth/change-password',
  },
  // HOMEMED staff user management (administrator only)
  staffUsers: {
    list: '/staff/users',
    detail: (id: string) => `/staff/users/${id}`,
    block: (id: string) => `/staff/users/${id}/block`,
    unblock: (id: string) => `/staff/users/${id}/unblock`,
    resetPassword: (id: string) => `/staff/users/${id}/reset-password`,
  },
  // HOMEMED operator panel (no trailing slashes — redirect_slashes=False)
  ops: {
    requests: '/ops/requests',
    newCount: '/ops/requests/new-count',
    detail: (id: string) => `/ops/requests/${id}`,
    take: (id: string) => `/ops/requests/${id}/take`,
    status: (id: string) => `/ops/requests/${id}/status`,
    assign: (id: string) => `/ops/requests/${id}/assign`,
    history: (id: string) => `/ops/requests/${id}/history`,
    clientLookup: '/ops/clients/lookup',
    paymentLink: (id: string) => `/ops/requests/${id}/payment/link`,
    paymentMark: (id: string) => `/ops/requests/${id}/payment/mark`,
  },
  districts: '/districts',
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
    schedule: (id: string) => `/admin/doctors/${id}/schedule/`,
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
  service: {
    list: '/admin/services/',
    create: '/admin/services/',
    details: (id: string) => `/admin/services/${id}`,
    image: (id: string) => `/admin/services/${id}/image`,
  },
  clinic: {
    list: '/admin/clinics/',
    create: '/admin/clinics/',
    details: (id: string) => `/admin/clinics/${id}`,
  },
  faq: {
    list: '/admin/faqs/',
    create: '/admin/faqs/',
    details: (id: string) => `/admin/faqs/${id}`,
  },
  tip: {
    list: '/admin/tips',
    create: '/admin/tips',
    details: (id: string) => `/admin/tips/${id}`,
    image: (id: string) => `/admin/tips/${id}/image`,
  },
  video: {
    list: '/admin/videos',
    create: '/admin/videos',
    details: (id: string) => `/admin/videos/${id}`,
    thumbnail: (id: string) => `/admin/videos/${id}/thumbnail`,
  },
  notification: {
    list: '/admin/notifications',
    create: '/admin/notifications',
    delete: (id: string) => `/admin/notifications/${id}`,
  },
  client: {
    list: '/admin/clients',
    details: (id: string) => `/admin/clients/${id}`,
  },
  consultationRequest: {
    list: '/admin/requests',
    details: (id: string) => `/admin/requests/${id}`,
    updateStatus: (id: string) => `/admin/requests/${id}/status`,
    invoice: (id: string) => `/admin/requests/${id}/invoice`,
  },
};
