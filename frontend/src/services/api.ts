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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Import dynamically or use standard window redirect to avoid circular dependencies
      window.location.href = '/login';
      
      // We can use a custom event or directly import toast if it doesn't cause issues
      // But standard toast from react-hot-toast works fine globally.
      import('react-hot-toast').then(module => {
        module.default.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
      });
    }
    return Promise.reject(error);
  }
);

export default api;
