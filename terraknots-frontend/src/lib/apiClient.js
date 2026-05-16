import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor — auto-add JWT token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalize responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Safe wrappers that NEVER throw
export const safeGet = async (endpoint, fallback = []) => {
  try {
    const res = await apiClient.get(endpoint);
    return res.data?.data ?? res.data ?? fallback;
  } catch (error) {
    console.error(`GET ${endpoint} failed:`, error.message);
    return fallback;
  }
};

export const safePost = async (endpoint, data) => {
  try {
    const res = await apiClient.post(endpoint, data);
    return { success: true, data: res.data?.data ?? res.data, error: null };
  } catch (error) {
    return { 
      success: false, 
      data: null, 
      error: error.response?.data?.message || error.message 
    };
  }
};

export const safePut = async (endpoint, data) => {
  try {
    const res = await apiClient.put(endpoint, data);
    return { success: true, data: res.data?.data ?? res.data, error: null };
  } catch (error) {
    return { 
      success: false, 
      data: null, 
      error: error.response?.data?.message || error.message 
    };
  }
};

export const safeDelete = async (endpoint) => {
  try {
    const res = await apiClient.delete(endpoint);
    return { success: true, data: res.data, error: null };
  } catch (error) {
    return { 
      success: false, 
      data: null, 
      error: error.response?.data?.message || error.message 
    };
  }
};

export default apiClient;
