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
  createDepartment: async (dept: Omit<Department, 'id'>): Promise<Department> => {
    return (await api.post<Department>('/departments', dept)).data;
  },
  updateDepartment: async (id: number, dept: Omit<Department, 'id'>): Promise<Department> => {
    return (await api.put<Department>(`/departments/${id}`, dept)).data;
  },
  deleteDepartment: async (id: number): Promise<void> => {
    await api.delete(`/departments/${id}`);
  }
};
