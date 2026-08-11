import api from './api';

export interface Department {
  id: number;
  name: string;
  description?: string;
}

export const departmentService = {
  getDepartments: async (): Promise<Department[]> => {
    return (await api.get<Department[]>('/departments')).data;
  },
  createDepartment: async (name: string): Promise<Department> => {
    return (await api.post<Department>('/departments', { name })).data;
  },
  updateDepartment: async (id: number, name: string): Promise<Department> => {
    return (await api.put<Department>(`/departments/${id}`, { name })).data;
  },
  deleteDepartment: async (id: number): Promise<void> => {
    await api.delete(`/departments/${id}`);
  }
};
