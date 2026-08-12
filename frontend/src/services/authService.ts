import api from './api';

export const authService = {
  login: async (email: string, password: string): Promise<string> => {
    const response = await api.post<{ token: string }>('/auth/login', { email, password });
    return response.data.token;
  },
  
  logout: () => {
    localStorage.clear();
  },
  
  getRoles: (): string[] => {
    const token = localStorage.getItem('token');
    if (!token) return [];
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roleClaim = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role;
      if (!roleClaim) return [];
      if (Array.isArray(roleClaim)) return roleClaim;
      return [roleClaim];
    } catch {
      return [];
    }
  },
  
  getUserInfo: () => {
    const token = localStorage.getItem('token');
    if (!token) return { username: 'User' };
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Check standard and short claim for username
      const username = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload.unique_name || 'User';
      return { username };
    } catch {
      return { username: 'User' };
    }
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};
