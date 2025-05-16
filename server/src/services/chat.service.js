import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import { AppError } from "../utils/app-error.js";
import mongoose from "mongoose";
import { logger } from "../config/logger.js";

export class ChatService {
  static async getMessages(contactId, userId, options = {}) {
    if (!contactId || !userId) {
      throw new AppError("Contact ID and User ID are required", 400);
    }

    if (
      !mongoose.Types.ObjectId.isValid(contactId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      throw new AppError("Invalid Contact ID or User ID format", 400);
    }

    const limit = options.limit || 50;
    const skip = options.page ? (options.page - 1) * limit : 0;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId },
      ],
    })
      .sort({ createdAt: options.oldestFirst ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    // If getting messages as a recipient, mark them as read
    if (!options.skipReadUpdate) {
      await Message.updateMany(
        { senderId: contactId, receiverId: userId, read: false },
        { read: true },
      );
    }

    return options.oldestFirst ? messages : messages.reverse();
  }

  static async getContacts(userId) {
    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid User ID format", 400);
    }

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 });

    const contactIds = new Set(
      messages
        .flatMap((msg) => [msg.senderId.toString(), msg.receiverId.toString()])
        .filter((id) => id !== userId.toString()),
    );

    return User.find({
      _id: { $in: Array.from(contactIds) },
    }).select("name avatar status lastSeen");
  }

  static async saveMessage(messageData) {
    // Validate required fields
    if (!messageData.content) {
      throw new AppError("Message content is required", 400);
    }

    if (!messageData.senderId || !messageData.receiverId) {
      logger.error("Missing sender or receiver ID", { messageData });
      throw new AppError("Sender ID and Receiver ID are required", 400);
    }

    // Validate ObjectId format
    if (
      !mongoose.Types.ObjectId.isValid(messageData.senderId) ||
      !mongoose.Types.ObjectId.isValid(messageData.receiverId)
    ) {
      logger.error("Invalid sender or receiver ID format", {
        senderId: messageData.senderId,
        receiverId: messageData.receiverId,
      });
      throw new AppError("Invalid Sender ID or Receiver ID format", 400);
    }

    // Verify both users exist
    const [sender, receiver] = await Promise.all([
      User.findById(messageData.senderId),
      User.findById(messageData.receiverId),
    ]);

    if (!sender || !receiver) {
      throw new AppError("Sender or receiver user not found", 404);
    }

    // Create message with validated data
    const message = await Message.create(messageData);

    // Create notification for the receiver
    await Notification.create({
      userId: messageData.receiverId,
      type: "message",
      content: `New message from ${sender.name}`,
      isRead: false,
      relatedId: message._id,
      relatedModel: "Message",
      sender: messageData.senderId,
    });

    return message;
  }

  static async getUnreadMessageCount(userId) {
    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid User ID format", 400);
    }

    return Message.countDocuments({
      receiverId: userId,
      read: false,
    });
  }

  static async getRecentChats(userId) {
    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid User ID format", 400);
    }

    // Find the most recent message for each conversation
    const contacts = await this.getContacts(userId);

    if (contacts.length === 0) {
      return [];
    }

    const recentChats = await Promise.all(
      contacts.map(async (contact) => {
        const latestMessage = await Message.findOne({
          $or: [
            { senderId: userId, receiverId: contact._id },
            { senderId: contact._id, receiverId: userId },
          ],
        })
          .sort({ createdAt: -1 })
          .limit(1);

        const unreadCount = await Message.countDocuments({
          senderId: contact._id,
          receiverId: userId,
          read: false,
        });

        return {
          contact: {
            _id: contact._id,
            name: contact.name,
            avatar: contact.avatar,
            status: contact.status,
            lastSeen: contact.lastSeen,
          },
          latestMessage,
          unreadCount,
        };
      }),
    );

    // Sort by latest message timestamp
    return recentChats.sort((a, b) => {
      const dateA = a.latestMessage
        ? new Date(a.latestMessage.createdAt)
        : new Date(0);
      const dateB = b.latestMessage
        ? new Date(b.latestMessage.createdAt)
        : new Date(0);
      return dateB - dateA;
    });
  }

  static async deleteMessages(messageIds, userId) {
    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      throw new AppError("Valid message IDs array is required", 400);
    }

    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    // Validate all IDs
    const invalidIds = messageIds.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id),
    );
    if (invalidIds.length > 0) {
      throw new AppError("Invalid message ID format", 400);
    }

    // Find messages that belong to the user (as sender only)
    const messagesToDelete = await Message.find({
      _id: { $in: messageIds },
      senderId: userId,
    });

    if (messagesToDelete.length === 0) {
      throw new AppError("No valid messages found to delete", 404);
    }

    const idsToDelete = messagesToDelete.map((msg) => msg._id);

    // Delete any notifications related to these messages
    await Notification.deleteMany({
      relatedId: { $in: idsToDelete },
      relatedModel: "Message",
    });

    // Delete the messages
    const result = await Message.deleteMany({ _id: { $in: idsToDelete } });

    return {
      deletedCount: result.deletedCount,
    };
  }
}
