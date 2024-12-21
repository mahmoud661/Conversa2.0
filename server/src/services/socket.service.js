import { logger } from '../config/logger.js';
import { ChatService } from './chat.service.js';

export const setupSocket = (io) => {
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);

    socket.on('authenticate', (userId) => {
      connectedUsers.set(userId, socket.id);
      socket.userId = userId;
      io.emit('userStatus', { userId, status: 'online' });
    });

    socket.on('message', async (data) => {
      try {
        const message = await ChatService.saveMessage(data);
        const receiverSocketId = connectedUsers.get(data.receiverId);
        
        socket.emit('messageSent', message);
        
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('messageReceived', message);
        }
      } catch (error) {
        logger.error('Error handling message:', error);
        socket.emit('messageError', { error: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        io.emit('userStatus', { userId: socket.userId, status: 'offline' });
      }
      logger.info(`User disconnected: ${socket.id}`);
    });
  });
};