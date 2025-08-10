import axios from 'axios';

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const api = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  params: {
    appid: apiKey,
    units: 'metric',
  },
  timeout: 10000, // 10 soniya timeout
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
    return Promise.reject(error);
  }
);
