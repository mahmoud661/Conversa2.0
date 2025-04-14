import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TokenStore {
  token: string | null;
  setToken: (token: string | null) => void;
  getToken: () => string | null;
  clearToken: () => void;
}

export const useTokenStore = create<TokenStore>()(
  persist(
    (set, get) => ({
      token: null,
      setToken: (token) => {
        set({ token });
        if (token) {
          localStorage.setItem('auth-token', token);
        } else {
          localStorage.removeItem('auth-token');
        }
      },
      getToken: () => get().token,
      clearToken: () => {
        set({ token: null });
        localStorage.removeItem('auth-token');
      },
    }),
    {
      name: 'auth-token-storage',
    }
  )
);

// Initialize token from localStorage if it exists
const initializeToken = () => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    useTokenStore.getState().setToken(token);
  }
};

// Run initialization once
initializeToken();