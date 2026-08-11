import api from './api';

export const authService = {
  login: async (email: string, password: string): Promise<string> => {
    const response = await api.post<{ token: string }>('/auth/login', { email, password });
    return response.data.token;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};
