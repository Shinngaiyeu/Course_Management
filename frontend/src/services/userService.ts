// import api from './api';

export interface Role {
  id: number;
  name: string;
}

export interface UserRole {
  roleId: number;
  role: Role;
}

export interface User {
  id: string;
  username: string;
  email: string;
  departmentId: number | null;
  isActive: boolean;
  userRoles: UserRole[];
}

// Dummy data to ensure UI works even if backend endpoint is missing for users list
const dummyUsers: User[] = [
  { id: '1', username: 'admin_super', email: 'admin@hris.local', departmentId: 1, isActive: true, userRoles: [{ roleId: 1, role: { id: 1, name: 'Admin' } }] },
  { id: '2', username: 'john_manager', email: 'john@hris.local', departmentId: 2, isActive: true, userRoles: [{ roleId: 2, role: { id: 2, name: 'Manager' } }] },
  { id: '3', username: 'jane_learner', email: 'jane@hris.local', departmentId: 3, isActive: true, userRoles: [{ roleId: 3, role: { id: 3, name: 'Learner' } }] },
  { id: '4', username: 'bob_locked', email: 'bob@hris.local', departmentId: 2, isActive: false, userRoles: [{ roleId: 3, role: { id: 3, name: 'Learner' } }] },
];

export const userService = {
  getUsers: async (): Promise<User[]> => {
    // In a real app: return (await api.get<User[]>('/users')).data;
    return new Promise((resolve) => setTimeout(() => resolve([...dummyUsers]), 500));
  },
  updateUser: async (user: User): Promise<User> => {
    // In a real app: return (await api.put<User>(`/users/${user.id}`, user)).data;
    return new Promise((resolve) => setTimeout(() => resolve(user), 500));
  }
};
