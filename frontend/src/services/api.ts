import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5206/api', // Connects to the real backend
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
