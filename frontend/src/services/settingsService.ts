import api from './api';

export const getWebhookPath = async (): Promise<string> => {
  const response = await api.get('/Settings/webhook-path');
  return response.data.path;
};

export const updateWebhookPath = async (path: string): Promise<void> => {
  await api.put('/Settings/webhook-path', { path });
};
