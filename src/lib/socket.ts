import { io, Socket } from 'socket.io-client';
import { Message } from '@/types';

class SocketService {
  private socket: Socket | null = null;
  private messageHandlers: ((message: Message) => void)[] = [];
  private statusHandlers: ((data: { userId: string; status: string }) => void)[] = [];

  connect(userId: string) {
    console.log('Socket: Connecting socket for user:', userId);
    
    this.socket = io('http://localhost:3000', {
      auth: {
        userId,
      },
    });

    this.socket.on('connect', () => {
      console.log('Socket: Connected successfully with ID:', this.socket?.id);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket: Connection error:', error);
    });

    this.socket.on('messageReceived', (message: Message) => {
      console.log('Socket: Message received:', message);
      this.messageHandlers.forEach((handler) => handler(message));
    });

    this.socket.on('messageSent', (message: Message) => {
      console.log('Socket: Server confirmed message sent:', message);
    });

    this.socket.on('messageError', (error) => {
      console.error('Socket: Message error from server:', error);
    });

    this.socket.on('userStatus', (data) => {
      console.log('Socket: User status update:', data);
      this.statusHandlers.forEach((handler) => handler(data));
    });
  }

  disconnect() {
    if (this.socket) {
      console.log('Socket: Disconnecting socket');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(message: Message) {
    if (this.socket) {
      console.log('Socket: Sending message via socket:', message);
      this.socket.emit('message', message);
    } else {
      console.error('Socket: Cannot send message, socket not connected');
    }
  }

  authenticate(userId: string) {
    if (this.socket) {
      console.log('Socket: Sending authentication for user:', userId);
      this.socket.emit('authenticate', userId);
    } else {
      console.error('Socket: Cannot authenticate, socket not connected');
    }
  }

  onMessage(handler: (message: Message) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  onUserStatus(handler: (data: { userId: string; status: string }) => void) {
    this.statusHandlers.push(handler);
    return () => {
      this.statusHandlers = this.statusHandlers.filter((h) => h !== handler);
    };
  }
}

export const socketService = new SocketService();