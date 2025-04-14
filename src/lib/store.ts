import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Message } from '@/types';
import { aiAssistant } from '@/data/contacts';

interface ChatStore {
  selectedContact: User | null;
  setSelectedContact: (contact: User | null) => void;
  chatHistory: Record<string, Message[]>;
  addMessage: (contactId: string, message: Message) => void;
  clearChatHistory: (contactId: string) => void;
  getChatHistoryForContact: (contactId: string) => Message[];
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      selectedContact: aiAssistant,
      setSelectedContact: (contact) => set({ selectedContact: contact }),
      chatHistory: {},
      addMessage: (contactId, message) => {
        if (!contactId) {
          console.error('Attempted to add message with undefined contactId');
          return;
        }
        
        // Check if we already have this message (by id) to prevent duplicates
        const existingMessages = get().chatHistory[contactId] || [];
        const isDuplicate = existingMessages.some(m => m.id === message.id);
        
        if (!isDuplicate) {
          console.log(`Adding message to chat history for contact ${contactId}:`, message);
          set((state) => ({
            chatHistory: {
              ...state.chatHistory,
              [contactId]: [...(state.chatHistory[contactId] || []), message],
            },
          }));
        } else {
          console.log(`Skipping duplicate message for contact ${contactId}:`, message.id);
        }
      },
      clearChatHistory: (contactId) => {
        set((state) => ({
          chatHistory: {
            ...state.chatHistory,
            [contactId]: [],
          },
        }));
      },
      getChatHistoryForContact: (contactId) => {
        return get().chatHistory[contactId] || [];
      },
    }),
    {
      name: 'chat-storage',
    }
  )
);