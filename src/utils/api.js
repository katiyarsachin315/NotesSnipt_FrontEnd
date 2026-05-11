import axios from 'axios';

// 🔥 LOCAL BACKEND URL - Change this on production
const BASE_URL = 'http://127.0.0.1:8000/api';

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
// 2. PROTECTED INSTANCE (For Normal User CRUD - With User Token)
// ============================================================
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Request interceptor for Normal User
api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// 🚨 Response interceptor for auto logout
api.interceptors.response.use(

  (response) => response,

  (error) => {

    // 🔥 User deleted / invalid token / unauthorized
    if (error.response?.status === 401) {

      localStorage.removeItem('access_token');
      localStorage.removeItem('userDetails');

      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);


// ============================================================
// 3. ADMIN INSTANCE (For Admin Dashboard - With Admin Token)
// ============================================================
export const adminApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// 🔐 Request interceptor for Admin
adminApi.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem('admin_token');

    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// 🚨 Admin auto logout
adminApi.interceptors.response.use(

  (response) => response,

  (error) => {

    if (error.response?.status === 401) {

      localStorage.removeItem('admin_token');
      localStorage.removeItem('adminDetails');

      window.location.href = '/admin/login';
    }

    return Promise.reject(error);
  }
);


// ============================================================
// Default export is the normal user api
// ============================================================
export default api;