import api from '@/lib/api';
import { User } from '@/types';

interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  /**
   * Log in a user with email and password
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    return data;
  },
  
  /**
   * Register a new user
   */
  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', { email, password, name });
    return data;
  },

  /**
   * Get the current user's profile
   */
  getProfile: async (): Promise<User> => {
    const { data } = await api.get<User>('/auth/profile');
    return data;
  },
};