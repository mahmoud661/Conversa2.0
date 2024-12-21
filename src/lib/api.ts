import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  
  register: async (email: string, password: string, name: string) => {
    const { data } = await api.post('/auth/register', { email, password, name });
    return data;
  },

  getProfile: async () => {
    const { data } = await api.get('/auth/profile');
    return data;
  },
};

export const chatApi = {
  getMessages: async (contactId: string) => {
    const { data } = await api.get(`/chat/messages/${contactId}`);
    return data;
  },

  getContacts: async () => {
    const { data } = await api.get('/chat/contacts');
    return data;
  },

  sendMessage: async (message: { content: string; receiverId: string }) => {
    const { data } = await api.post('/chat/messages', message);
    return data;
  },
};

export const userApi = {
  getUsers: async () => {
    const { data } = await api.get('/users');
    return data;
  },
};

export default api;