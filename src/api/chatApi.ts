import api from '@/lib/api';
import { Message, User } from '@/types';

export const chatApi = {
  /**
   * Get messages for a specific contact
   */
  getMessages: async (contactId: string): Promise<Message[]> => {
    try {
      if (!contactId) {
        console.warn('Attempted to fetch messages with undefined contactId');
        return [];
      }
      console.log(`chatApi: Getting messages for contact ${contactId}`);
      const { data } = await api.get<Message[]>(`/chat/messages/${contactId}`);
      console.log(`chatApi: Received ${data.length} messages for contact ${contactId}`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch messages for contact ${contactId}:`, error);
      throw error;
    }
  },

  /**
   * Get all contacts for the current user
   */
  getContacts: async (): Promise<User[]> => {
    console.log('chatApi: Getting contacts');
    const { data } = await api.get<User[]>('/chat/contacts');
    console.log(`chatApi: Received ${data.length} contacts`);
    return data;
  },

  /**
   * Send a message to a contact
   */
  sendMessage: async (message: { content: string; receiverId: string }): Promise<Message> => {
    try {
      console.log('chatApi: Sending message to API:', message);
      console.log('chatApi: API endpoint:', '/chat/messages');
      const { data } = await api.post<Message>('/chat/messages', message);
      console.log('chatApi: Message sent successfully, server response:', data);
      return data;
    } catch (error) {
      console.error('chatApi: Failed to send message:', error);
      if (error.response) {
        console.error('chatApi: Error response:', error.response.data);
        console.error('chatApi: Error status:', error.response.status);
      }
      throw error;
    }
  },
};