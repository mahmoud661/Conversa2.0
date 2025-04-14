import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/api/authApi';
import { useTokenStore } from './tokenStore';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

// Validate user object to ensure it has required fields
const validateUser = (user: User | null): User | null => {
  if (!user) return null;
  if (!user.id || !user.email || !user.name) {
    console.warn("Invalid user object detected, forcing re-login");
    return null;
  }
  return user;
};

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user: validateUser(user), isAuthenticated: !!user }),
      login: async (email, password) => {
        const { token, user } = await authApi.login(email, password);
        useTokenStore.getState().setToken(token);
        set({ user: validateUser(user), isAuthenticated: true });
      },
      signup: async (email, password, name) => {
        const { token, user } = await authApi.register(email, password, name);
        useTokenStore.getState().setToken(token);
        set({ user: validateUser(user), isAuthenticated: true });
      },
      logout: () => {
        useTokenStore.getState().clearToken();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        // Validate user after storage rehydration
        if (state && state.user) {
          state.user = validateUser(state.user);
          state.isAuthenticated = !!state.user;
        }
      }
    }
  )
);