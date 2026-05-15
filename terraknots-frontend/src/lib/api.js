import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        // Try cookie first (customer app), then localStorage (admin panel)
        const token = Cookies.get('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized (e.g., clear cookies, redirect to login)
            Cookies.remove('token');
            Cookies.remove('user');
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                // window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
