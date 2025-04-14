import api from '@/lib/api';
import { User } from '@/types';

export const userApi = {
  /**
   * Get all users
   */
  getUsers: async (): Promise<User[]> => {
    const { data } = await api.get<User[]>('/users');
    return data;
  },
  
  /**
   * Update a user's profile
   */
  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    const { data } = await api.put<User>('/users/profile', profileData);
    return data;
  },
};