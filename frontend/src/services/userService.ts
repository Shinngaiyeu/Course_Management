

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
  departmentId?: number;
  department?: string;
  roles: string[];
  roleIds?: number[];
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
        departmentId: u.departmentId,
        department: u.department?.name,
        roles: u.roles?.map((r: any) => r.name) || [],
        roleIds: u.roles?.map((r: any) => r.id) || [],
        status: u.isActive ? 'Active' : 'Locked'
      }))
    };
  },
  updateUser: async (user: User): Promise<User> => {

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      departmentId: user.departmentId,
      isActive: user.status === 'Active',
      roleIds: user.roleIds
    };
    await api.patch(`/users/${user.id}`, payload);
    return user;
  },
  createUser: async (payload: any): Promise<User> => {
    const data = (await api.post<any>('/users', payload)).data;
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      departmentId: data.departmentId,
      department: data.department?.name,
      roles: data.roles?.map((r: any) => r.name) || [],
      roleIds: data.roles?.map((r: any) => r.id) || [],
      status: data.isActive ? 'Active' : 'Locked'
    };
  }
};
