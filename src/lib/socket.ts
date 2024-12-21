import { io, Socket } from 'socket.io-client';
import { Message } from '@/types';

class SocketService {
  private socket: Socket | null = null;
  private messageHandlers: ((message: Message) => void)[] = [];
  private statusHandlers: ((data: { userId: string; status: string }) => void)[] = [];

  connect(userId: string) {
    this.socket = io('http://localhost:3000', {
      auth: {
        userId,
      },
    });

    this.socket.on('messageReceived', (message: Message) => {
      this.messageHandlers.forEach((handler) => handler(message));
    });

    this.socket.on('userStatus', (data) => {
      this.statusHandlers.forEach((handler) => handler(data));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(message: Message) {
    if (this.socket) {
      this.socket.emit('message', message);
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