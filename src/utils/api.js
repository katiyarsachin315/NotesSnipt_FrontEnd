import axios from 'axios';

const BASE_URL = 'https://katiyarsachin315.pythonanywhere.com/api';

// ============================================================
// 1. OPEN INSTANCE (For Login, Signup - No Token Required)
// ============================================================
export const openApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================
// 2. PROTECTED INSTANCE (For CRUD Operations - With Token)
// ============================================================
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Automatically adds the Token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;