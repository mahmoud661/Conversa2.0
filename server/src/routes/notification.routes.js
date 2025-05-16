import express from "express";
import { NotificationController } from "../controllers/notification.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

// Get all notifications
router.get("/", NotificationController.getNotifications);

// Get unread notification count
router.get("/unread-count", NotificationController.getUnreadCount);

// Mark all notifications as read
router.patch("/mark-all-read", NotificationController.markAllAsRead);

// Mark notification as read
router.patch("/:id/mark-read", NotificationController.markAsRead);

// Delete a notification
router.delete("/:id", NotificationController.deleteNotification);

export default router;
