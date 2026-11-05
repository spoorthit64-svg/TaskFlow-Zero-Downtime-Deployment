import axios from 'axios';

// Get base URL from environment or default to localhost:8080
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Bearer Token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format errors and handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with an error status (4xx, 5xx)
      if (error.response.status === 401) {
        // Clear expired auth session
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
        window.dispatchEvent(new CustomEvent('taskflow_auth_unauthorized'));
      }
      
      const serverMessage = error.response.data?.message || 
                            error.response.data?.error || 
                            'An error occurred on the server';
      return Promise.reject(new Error(serverMessage));
    } else if (error.request) {
      // Request was made but no response was received (network failure / backend offline)
      const networkMessage = 'Cannot connect to backend server. Please verify the server is running and accessible.';
      window.dispatchEvent(new CustomEvent('taskflow_backend_offline'));
      return Promise.reject(new Error(networkMessage));
    } else {
      return Promise.reject(new Error(error.message || 'Request failed'));
    }
  }
);

export default api;