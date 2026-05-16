import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const safeFetch = async (endpoint, options = {}) => {
  try {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('token') 
      : null;
    
    const config = {
      ...options,
      headers: {
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` })
      }
    };
    
    const res = await axios(`${API_URL}${endpoint}`, config);
    return { 
      success: true, 
      data: res.data?.data || res.data?.categories || res.data?.products || res.data?.orders || res.data || [], 
      error: null 
    };
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error.message);
    return { 
      success: false, 
      data: [], 
      error: error.response?.data?.message || error.message 
    };
  }
};
