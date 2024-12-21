import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { aiAssistant } from '@/data/contacts';

interface ChatStore {
  selectedContact: User | null;
  setSelectedContact: (contact: User | null) => void;
  chatHistory: Record<string, Message[]>;
  addMessage: (contactId: string, message: Message) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      selectedContact: aiAssistant,
      setSelectedContact: (contact) => set({ selectedContact: contact }),
      chatHistory: {},
      addMessage: (contactId, message) =>
        set((state) => ({
          chatHistory: {
            ...state.chatHistory,
            [contactId]: [...(state.chatHistory[contactId] || []), message],
          },
        })),
    }),
    {
      name: 'chat-storage',
    }
  )
);