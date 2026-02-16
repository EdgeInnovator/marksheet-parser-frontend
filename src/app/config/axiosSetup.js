import axios from "axios";
import { getCokie } from "../utils/utils";

export const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    Accept: "application/json",
  },
});

// Add authentication interceptor
api.interceptors.request.use(
  (config) => {
    const token = getCokie('access_token');
    console.log('=== AXIOS REQUEST ===');
    console.log('URL:', config.url);
    console.log('Method:', config.method);
    console.log('Has token:', !!token);
    console.log('Data:', config.data);
    console.log('Headers:', config.headers);
    console.log('=== END AXIOS REQUEST ===');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't set Content-Type for FormData (let browser set it with boundary)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('=== AXIOS RESPONSE ===');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    console.log('Headers:', response.headers);
    console.log('=== END AXIOS RESPONSE ===');
    return response;
  },
  (error) => {
    console.log('=== AXIOS ERROR ===');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.message);
    console.log('=== END AXIOS ERROR ===');
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);