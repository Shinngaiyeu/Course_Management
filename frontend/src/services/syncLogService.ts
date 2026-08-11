import api from './api';

export interface SyncLog {
  id: number;
  syncDate: string;
  status: string;
  payload: string;
  message: string;
}

export const syncLogService = {
  getLogs: async (): Promise<SyncLog[]> => {
    return (await api.get<SyncLog[]>('/synclogs')).data;
  }
};
