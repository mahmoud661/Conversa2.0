import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      login: async (email, password) => {
        const { token, user } = await authApi.login(email, password);
        localStorage.setItem('auth-token', token);
        set({ user, token, isAuthenticated: true });
      },
      signup: async (email, password, name) => {
        const { token, user } = await authApi.register(email, password, name);
        localStorage.setItem('auth-token', token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('auth-token');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);