'use client';
import { useEffect } from 'react';

export default function BackendWarmer() {
  useEffect(() => {
    // Ping backend to wake it up on app load
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (API_URL) {
      fetch(`${API_URL}/health`).catch(() => {});
    }
  }, []);
  
  return null;
}
