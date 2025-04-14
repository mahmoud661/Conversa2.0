import axios from 'axios';
import { useTokenStore } from './tokenStore';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token using our token store
api.interceptors.request.use((config) => {
  const token = useTokenStore.getState().getToken();
  console.log('API Interceptor: Token available?', !!token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('API Interceptor: Added auth header for request to', config.url);
  } else {
    console.warn('API Interceptor: No auth token available for request to', config.url);
  }
  
  return config;
});

// Add response interceptor for better debugging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response [${response.status}] from ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        `API Error [${error.response.status}] from ${error.config?.method?.toUpperCase()} ${error.config?.url}:`,
        error.response.data
      );
    } else if (error.request) {
      console.error(`API Error: No response received for ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Export a clean API instance without the auth exports
export default api;