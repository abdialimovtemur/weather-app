import axios from 'axios';

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const api = axios.create({
  baseURL: 'https://api.openweathermap.org',
  params: {
    appid: apiKey,
    units: 'metric',
  },
  timeout: 10000, // 10 soniya timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor - loading holatini ko'rsatish uchun
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - error handling uchun
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('API request timeout');
    }
    
    // Log CORS errors specifically
    if (error.message?.includes('CORS') || error.message?.includes('cross-origin')) {
      console.error('CORS error detected:', error.message);
    }
    
    return Promise.reject(error);
  }
);
