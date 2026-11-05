import api from './axios';

export const taskApi = {
  getTasks: async (params = {}) => {
    const response = await api.get('/api/tasks', { params });
    return response.data;
  },

  getTaskById: async (id) => {
    const response = await api.get(`/api/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/api/tasks', taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/api/tasks/${id}`, taskData);
    return response.data;
  },

  updateTaskStatus: async (id, status) => {
    const response = await api.patch(`/api/tasks/${id}/status`, { status });
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/api/tasks/${id}`);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/api/tasks/stats');
    return response.data;
  },
};