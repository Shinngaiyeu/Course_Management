import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7165/api', // Default HTTPS port for .NET 8 webapi
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
