import api from './axios';

export const healthApi = {
  checkHealth: async () => {
    const response = await api.get('/api/health');
    return response.data;
  },
};