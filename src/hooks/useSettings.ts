import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  soundEnabled: boolean;
  language: string;
  autoTranslate: boolean;
  fontSize: 'small' | 'medium' | 'large';
  smartReplies: boolean;
  readReceipts: boolean;
}

interface SettingsStore extends Settings {
  updateSettings: (settings: Partial<Settings>) => void;
}

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'system',
      notifications: true,
      soundEnabled: true,
      language: 'en',
      autoTranslate: false,
      fontSize: 'medium',
      smartReplies: true,
      readReceipts: true,
      updateSettings: (newSettings) => set((state) => ({ ...state, ...newSettings })),
    }),
    {
      name: 'chat-settings',
    }
  )
);