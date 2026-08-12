import api from './api';

export interface Lesson {
  id: number;
  courseModuleId: number;
  title: string;
  content?: string;
  videoUrl?: string;
  metadata?: string;
  orderIndex: number;
}

export interface CourseModule {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  orderIndex: number;
  lessons: Lesson[];
}

export interface Course {
  id: number;
  title: string;
  description?: string;
  instructorId?: string;
  instructorName?: string;
  status: 0 | 1 | 2; // 0=Draft, 1=Published, 2=Archived
  createdAt: string;
  updatedAt?: string;
  modules: CourseModule[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export const courseService = {
  // Course
  getCourses: async (page = 1, pageSize = 10, search?: string): Promise<PagedResult<Course>> => {
    const params = new URLSearchParams({
      pageNumber: page.toString(),
      pageSize: pageSize.toString()
    });
    if (search) params.append('searchTerm', search);
    return (await api.get<PagedResult<Course>>(`/courses?${params.toString()}`)).data;
  },
  getCourse: async (id: number): Promise<Course> => {
    return (await api.get<Course>(`/courses/${id}`)).data;
  },
  createCourse: async (payload: any): Promise<Course> => {
    return (await api.post<Course>('/courses', payload)).data;
  },
  updateCourse: async (id: number, payload: any): Promise<Course> => {
    return (await api.put<Course>(`/courses/${id}`, payload)).data;
  },
  deleteCourse: async (id: number): Promise<void> => {
    await api.delete(`/courses/${id}`);
  },

  // Module
  createModule: async (courseId: number, payload: any): Promise<CourseModule> => {
    payload.courseId = courseId; // Ensure payload has courseId
    return (await api.post<CourseModule>(`/coursemodules`, payload)).data;
  },
  updateModule: async (id: number, payload: any): Promise<CourseModule> => {
    return (await api.put<CourseModule>(`/coursemodules/${id}`, payload)).data;
  },
  deleteModule: async (id: number): Promise<void> => {
    await api.delete(`/coursemodules/${id}`);
  },

  // Lesson
  createLesson: async (moduleId: number, payload: any): Promise<Lesson> => {
    payload.courseModuleId = moduleId;
    return (await api.post<Lesson>(`/lessons`, payload)).data;
  },
  updateLesson: async (id: number, payload: any): Promise<Lesson> => {
    return (await api.put<Lesson>(`/lessons/${id}`, payload)).data;
  },
  deleteLesson: async (id: number): Promise<void> => {
    await api.delete(`/lessons/${id}`);
  },

  // Upload API
  uploadFile: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.url;
  },

  // AI Agent
  suggestContent: async (rawContent: string): Promise<{ suggestedTitle: string, suggestedDescription: string }> => {
    return (await api.post('/aiagent/suggest', { rawContent })).data;
  }
};
