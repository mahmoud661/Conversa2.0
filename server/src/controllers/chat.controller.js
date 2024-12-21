import { ChatService } from '../services/chat.service.js';

export class ChatController {
  static async getMessages(req, res, next) {
    try {
      const messages = await ChatService.getMessages(req.params.contactId, req.user.id);
      res.json(messages);
    } catch (error) {
      next(error);
    }
  }

  static async getContacts(req, res, next) {
    try {
      const contacts = await ChatService.getContacts(req.user.id);
      res.json(contacts);
    } catch (error) {
      next(error);
    }
  }
}