import api from './api';

export interface SyncLog {
  id: number;
  syncDate: string;
  status: string;
  payload: string;
  message: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages?: number;
}

export const syncLogService = {
  getLogs: async (page = 1, pageSize = 10, status?: string): Promise<PagedResult<SyncLog>> => {
    const params = new URLSearchParams({
      pageNumber: page.toString(),
      pageSize: pageSize.toString()
    });
    if (status && status !== 'All') {
      params.append('status', status);
    }
    return (await api.get<PagedResult<SyncLog>>(`/synclogs?${params.toString()}`)).data;
  },
  retrySyncLog: async (id: number): Promise<{ success: boolean; message?: string }> => {
    return (await api.post(`/synclogs/${id}/retry`)).data;
  }
};
