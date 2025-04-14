import { Message } from '../models/message.model.js';
import { User } from '../models/user.model.js';
import { AppError } from '../utils/app-error.js';
import mongoose from 'mongoose';
import { logger } from '../config/logger.js';

export class ChatService {
  static async getMessages(contactId, userId) {
    if (!contactId || !userId) {
      throw new AppError('Contact ID and User ID are required', 400);
    }
    
    if (!mongoose.Types.ObjectId.isValid(contactId) || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError('Invalid Contact ID or User ID format', 400);
    }
    
    return Message.find({
      $or: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId }
      ]
    })
    .sort({ createdAt: 1 })
    .limit(50);
  }

  static async getContacts(userId) {
    if (!userId) {
      throw new AppError('User ID is required', 400);
    }
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError('Invalid User ID format', 400);
    }
    
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    })
    .sort({ createdAt: -1 });

    const contactIds = new Set(
      messages.flatMap(msg => [msg.senderId, msg.receiverId])
        .filter(id => id.toString() !== userId)
    );

    return User.find({
      _id: { $in: Array.from(contactIds) }
    });
  }

  static async saveMessage(messageData) {
    // Validate required fields
    if (!messageData.content) {
      throw new AppError('Message content is required', 400);
    }
    
    if (!messageData.senderId || !messageData.receiverId) {
      logger.error('Missing sender or receiver ID', { messageData });
      throw new AppError('Sender ID and Receiver ID are required', 400);
    }
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(messageData.senderId) || 
        !mongoose.Types.ObjectId.isValid(messageData.receiverId)) {
      logger.error('Invalid sender or receiver ID format', { 
        senderId: messageData.senderId,
        receiverId: messageData.receiverId
      });
      throw new AppError('Invalid Sender ID or Receiver ID format', 400);
    }
    
    // Verify both users exist
    const [sender, receiver] = await Promise.all([
      User.findById(messageData.senderId),
      User.findById(messageData.receiverId)
    ]);
    
    if (!sender || !receiver) {
      throw new AppError('Sender or receiver user not found', 404);
    }
    
    // Create message with validated data
    return Message.create(messageData);
  }
}