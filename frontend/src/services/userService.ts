// import api from './api';

export interface Role {
  id: number;
  name: string;
}

export interface UserRole {
  roleId: number;
  role: Role;
}

import api from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  department?: string;
  roles: string[];
  status: 'Active' | 'Locked';
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export const userService = {
  getUsers: async (page = 1, pageSize = 10, departmentId?: number, search?: string): Promise<PagedResult<User>> => {
    const params = new URLSearchParams({
      pageNumber: page.toString(),
      pageSize: pageSize.toString()
    });
    
    if (departmentId) params.append('departmentId', departmentId.toString());
    if (search) params.append('searchTerm', search);

    const data = (await api.get<any>(`/users?${params.toString()}`)).data;
    
    return {
      ...data,
      items: data.items.map((u: any) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        department: u.department?.name,
        roles: u.roles?.map((r: any) => r.name) || [],
        status: u.isActive ? 'Active' : 'Locked'
      }))
    };
  },
  updateUser: async (user: User): Promise<User> => {
    // We map frontend User back to what backend expects for update
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      isActive: user.status === 'Active'
    };
    await api.patch(`/users/${user.id}`, payload);
    return user;
  }
};
