import axios from 'axios';

export const API_BASE_URL = 'http://localhost:5206/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      window.location.href = '/login';

      import('react-hot-toast').then(module => {
        module.default.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
      });
    }
    return Promise.reject(error);
  }
);

export default api;
