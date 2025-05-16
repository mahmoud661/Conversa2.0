import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  user: { id: string; name: string; email: string } | null;
  token: string | null;
  setToken: (token: string) => void;
  setUser: (user: { id: string; name: string; email: string }) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      setToken: (token) => set({ token, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      logout: () => set({ isAuthenticated: false, user: null, token: null }),
    }),
    {
      name: "conversa-auth-storage",
      getStorage: () => localStorage,
    }
  )
);
export default useAuthStore;

