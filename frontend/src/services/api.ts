import axios from 'axios';

// Create an Axios instance with base configuration
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

import { store } from '../store';
import { logout, loginSuccess } from '../store/slices/employerSlice';

// Add interceptors for attaching auth tokens
api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.employer.accessToken;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling 401 token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, { refreshToken });
        
        if (data.status) {
          // Update Redux
          store.dispatch(loginSuccess({ 
            employerId: data.data.employerId, 
            accessToken: data.data.accessToken,
            logoUrl: data.data.logoUrl
          }));
          
          if (data.data.refreshToken) {
            localStorage.setItem('refreshToken', data.data.refreshToken);
          }

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        store.dispatch(logout());
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
