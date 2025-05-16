import { NotificationService } from "../services/notification.service.js";
import { logger } from "../config/logger.js";
import { AppError } from "../utils/app-error.js";

export class NotificationController {
  static async getNotifications(req, res, next) {
    try {
      const userId = req.user._id;
      const { isRead, page, limit } = req.query;

      const options = {};

      if (isRead !== undefined) {
        options.isRead = isRead === "true";
      }

      if (page) {
        options.page = parseInt(page);
      }

      if (limit) {
        options.limit = parseInt(limit);
      }

      const notifications = await NotificationService.getUserNotifications(
        userId,
        options,
      );

      res.status(200).json({
        status: "success",
        results: notifications.length,
        data: { notifications },
      });
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const notification = await NotificationService.markAsRead(id, userId);

      res.status(200).json({
        status: "success",
        data: { notification },
      });
    } catch (error) {
      next(error);
    }
  }

  static async markAllAsRead(req, res, next) {
    try {
      const userId = req.user._id;

      const result = await NotificationService.markAllAsRead(userId);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteNotification(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      await NotificationService.deleteNotification(id, userId);

      res.status(204).json({
        status: "success",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUnreadCount(req, res, next) {
    try {
      const userId = req.user._id;

      const count = await NotificationService.getUnreadCount(userId);

      res.status(200).json({
        status: "success",
        data: { count },
      });
    } catch (error) {
      next(error);
    }
  }
}
