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
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);