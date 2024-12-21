import { Message } from '../models/message.model.js';
import { User } from '../models/user.model.js';
import { AppError } from '../utils/app-error.js';

export class ChatService {
  static async getMessages(contactId, userId) {
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
    return Message.create(messageData);
  }
}