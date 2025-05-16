import { ChatService } from "../services/chat.service.js";
import { logger } from "../config/logger.js";
import { AppError } from "../utils/app-error.js";

export class ChatController {
  static async getMessages(req, res, next) {
    try {
      const contactId = req.params.contactId;
      const userId = req.user._id;
      const { page, limit, oldestFirst, skipReadUpdate } = req.query;

      logger.info(
        `Getting messages for contact ${contactId} by user ${userId}`,
      );

      const options = {
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
        oldestFirst: oldestFirst === "true",
        skipReadUpdate: skipReadUpdate === "true",
      };

      const messages = await ChatService.getMessages(
        contactId,
        userId,
        options,
      );

      logger.info(
        `Returning ${messages.length} messages for contact ${contactId}`,
      );

      res.status(200).json({
        status: "success",
        results: messages.length,
        data: { messages },
      });
    } catch (error) {
      logger.error(`Error getting messages: ${error.message}`, { error });
      next(error);
    }
  }

  static async getContacts(req, res, next) {
    try {
      const userId = req.user._id;

      logger.info(`Getting contacts for user ${userId}`);

      const contacts = await ChatService.getContacts(userId);

      logger.info(`Returning ${contacts.length} contacts for user ${userId}`);

      res.status(200).json({
        status: "success",
        results: contacts.length,
        data: { contacts },
      });
    } catch (error) {
      logger.error(`Error getting contacts: ${error.message}`, { error });
      next(error);
    }
  }

  static async sendMessage(req, res, next) {
    try {
      const { content, receiverId } = req.body;
      const userId = req.user._id;

      logger.info(
        `Received message request from user ${userId} to ${receiverId}`,
        {
          contentPreview: content
            ? content.substring(0, 50) + (content.length > 50 ? "..." : "")
            : "empty",
          receiverId,
        },
      );

      if (!content || !receiverId) {
        logger.warn("Missing content or receiverId in message request");
        throw new AppError("Content and receiverId are required", 400);
      }

      const messageData = {
        content,
        senderId: userId,
        receiverId,
        read: false,
      };

      logger.info("Processing message with data", {
        senderId: messageData.senderId,
        receiverId: messageData.receiverId,
        contentLength: messageData.content.length,
      });

      const message = await ChatService.saveMessage(messageData);

      logger.info(`Message saved successfully with ID: ${message._id}`);

      res.status(201).json({
        status: "success",
        data: { message },
      });
    } catch (error) {
      logger.error(`Error sending message: ${error.message}`, { error });
      next(error);
    }
  }

  static async getRecentChats(req, res, next) {
    try {
      const userId = req.user._id;

      logger.info(`Getting recent chats for user ${userId}`);

      const recentChats = await ChatService.getRecentChats(userId);

      logger.info(
        `Returning ${recentChats.length} recent chats for user ${userId}`,
      );

      res.status(200).json({
        status: "success",
        results: recentChats.length,
        data: { recentChats },
      });
    } catch (error) {
      logger.error(`Error getting recent chats: ${error.message}`, { error });
      next(error);
    }
  }

  static async getUnreadCount(req, res, next) {
    try {
      const userId = req.user._id;

      logger.info(`Getting unread message count for user ${userId}`);

      const count = await ChatService.getUnreadMessageCount(userId);

      logger.info(`User ${userId} has ${count} unread messages`);

      res.status(200).json({
        status: "success",
        data: { count },
      });
    } catch (error) {
      logger.error(`Error getting unread count: ${error.message}`, { error });
      next(error);
    }
  }

  static async deleteMessages(req, res, next) {
    try {
      const { messageIds } = req.body;
      const userId = req.user._id;

      if (
        !messageIds ||
        !Array.isArray(messageIds) ||
        messageIds.length === 0
      ) {
        throw new AppError("Valid message IDs array is required", 400);
      }

      logger.info(`Deleting ${messageIds.length} messages for user ${userId}`);

      const result = await ChatService.deleteMessages(messageIds, userId);

      logger.info(`Deleted ${result.deletedCount} messages for user ${userId}`);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      logger.error(`Error deleting messages: ${error.message}`, { error });
      next(error);
    }
  }
}
