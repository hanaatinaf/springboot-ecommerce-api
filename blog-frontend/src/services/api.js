import axios from 'axios';

// Create a reusable Axios instance pointed at our backend
// Every call made via this instance goes to localhost:8080
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

// INTERCEPTOR: runs before every request is sent.
// It automatically attaches the JWT token from localStorage to every request.
// This means we never have to manually add the Authorization header in each service call.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
