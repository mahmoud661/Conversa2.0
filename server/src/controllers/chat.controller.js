import { ChatService } from '../services/chat.service.js';
import { logger } from '../config/logger.js';

export class ChatController {
  static async getMessages(req, res, next) {
    try {
      logger.info(`Getting messages for contact ${req.params.contactId} by user ${req.user.id}`);
      const messages = await ChatService.getMessages(req.params.contactId, req.user.id);
      logger.info(`Returning ${messages.length} messages for contact ${req.params.contactId}`);
      res.json(messages);
    } catch (error) {
      logger.error(`Error getting messages: ${error.message}`, { error });
      next(error);
    }
  }

  static async getContacts(req, res, next) {
    try {
      logger.info(`Getting contacts for user ${req.user.id}`);
      const contacts = await ChatService.getContacts(req.user.id);
      logger.info(`Returning ${contacts.length} contacts for user ${req.user.id}`);
      res.json(contacts);
    } catch (error) {
      logger.error(`Error getting contacts: ${error.message}`, { error });
      next(error);
    }
  }

  static async sendMessage(req, res, next) {
    try {
      const { content, receiverId } = req.body;
      
      logger.info(`Received message request from user ${req.user.id} to ${receiverId}`, { 
        content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
        receiverId 
      });
      
      if (!content || !receiverId) {
        logger.warn('Missing content or receiverId in message request');
        return res.status(400).json({ message: 'Content and receiverId are required' });
      }
      
      const messageData = {
        content,
        senderId: req.user.id,
        receiverId,
        timestamp: new Date()
      };
      
      logger.info('Processing message with data:', messageData);
      const message = await ChatService.saveMessage(messageData);
      logger.info(`Message saved successfully with ID: ${message.id || message._id}`);
      res.status(201).json(message);
    } catch (error) {
      logger.error(`Error sending message: ${error.message}`, { error });
      next(error);
    }
  }
}