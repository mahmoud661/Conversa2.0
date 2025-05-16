import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import mongoose from "mongoose";
import { logger } from "../config/logger.js";

export class NotificationService {
  static async createNotification(notificationData) {
    // Validate required fields
    if (
      !notificationData.userId ||
      !notificationData.type ||
      !notificationData.content
    ) {
      logger.error("Missing required notification fields", {
        notificationData,
      });
      throw new AppError("User ID, type, and content are required", 400);
    }

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(notificationData.userId)) {
      logger.error("Invalid user ID format", {
        userId: notificationData.userId,
      });
      throw new AppError("Invalid User ID format", 400);
    }

    // Verify user exists
    const user = await User.findById(notificationData.userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Validate relatedId if present
    if (
      notificationData.relatedId &&
      !mongoose.Types.ObjectId.isValid(notificationData.relatedId)
    ) {
      logger.error("Invalid related ID format", {
        relatedId: notificationData.relatedId,
      });
      throw new AppError("Invalid related ID format", 400);
    }

    // Create notification with validated data
    return Notification.create(notificationData);
  }

  static async getUserNotifications(userId, options = {}) {
    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid User ID format", 400);
    }

    const query = { userId };

    // Filter by read status if specified
    if (options.isRead !== undefined) {
      query.isRead = options.isRead;
    }

    const limit = options.limit || 20;
    const skip = options.page ? (options.page - 1) * limit : 0;

    return Notification.find(query)
      .populate("sender", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  static async markAsRead(notificationId, userId) {
    if (!notificationId) {
      throw new AppError("Notification ID is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      throw new AppError("Invalid Notification ID format", 400);
    }

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    // Security check - ensure user owns the notification
    if (notification.userId.toString() !== userId) {
      logger.warn("Unauthorized attempt to mark notification as read", {
        notificationId,
        userId,
        notificationOwnerId: notification.userId,
      });
      throw new AppError("Not authorized to modify this notification", 403);
    }

    notification.isRead = true;
    return notification.save();
  }

  static async markAllAsRead(userId) {
    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid User ID format", 400);
    }

    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true },
    );

    return { updatedCount: result.modifiedCount };
  }

  static async deleteNotification(notificationId, userId) {
    if (!notificationId) {
      throw new AppError("Notification ID is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      throw new AppError("Invalid Notification ID format", 400);
    }

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    // Security check - ensure user owns the notification
    if (notification.userId.toString() !== userId) {
      logger.warn("Unauthorized attempt to delete notification", {
        notificationId,
        userId,
        notificationOwnerId: notification.userId,
      });
      throw new AppError("Not authorized to delete this notification", 403);
    }

    return Notification.findByIdAndDelete(notificationId);
  }

  static async getUnreadCount(userId) {
    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid User ID format", 400);
    }

    return Notification.countDocuments({ userId, isRead: false });
  }
}
