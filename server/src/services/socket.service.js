import { logger } from "../config/logger.js";
import { ChatService } from "./chat.service.js";
import { NotificationService } from "./notification.service.js";
import { User } from "../models/user.model.js";

export const setupSocket = (io) => {
  const connectedUsers = new Map();

  io.on("connection", (socket) => {
    logger.info(`User connected: ${socket.id}`);

    socket.on("authenticate", async (userId) => {
      try {
        connectedUsers.set(userId, socket.id);
        socket.userId = userId;

        // Update user status to online
        await User.findByIdAndUpdate(userId, {
          status: "online",
          lastSeen: new Date(),
        });

        // Broadcast to all clients that this user is online
        io.emit("userStatus", { userId, status: "online" });

        // Send unread counts to the user who just connected
        const unreadMessages = await ChatService.getUnreadMessageCount(userId);
        const unreadNotifications =
          await NotificationService.getUnreadCount(userId);

        socket.emit("unreadCounts", {
          messages: unreadMessages,
          notifications: unreadNotifications,
        });
      } catch (error) {
        logger.error("Error in authenticate event:", error);
      }
    });

    socket.on("message", async (data) => {
      try {
        const message = await ChatService.saveMessage(data);
        const receiverSocketId = connectedUsers.get(data.receiverId);

        // Send confirmation to sender
        socket.emit("messageSent", message);

        // Send message to receiver if they're online
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("messageReceived", message);

          // Also send updated unread counts
          const unreadMessages = await ChatService.getUnreadMessageCount(
            data.receiverId,
          );
          io.to(receiverSocketId).emit("unreadCounts", {
            messages: unreadMessages,
            notifications: 0, // We're just updating message count here
          });
        }
      } catch (error) {
        logger.error("Error handling message:", error);
        socket.emit("messageError", { error: "Failed to send message" });
      }
    });

    socket.on("typing", (data) => {
      const { receiverId } = data;
      const receiverSocketId = connectedUsers.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userTyping", {
          userId: socket.userId,
          typing: true,
        });
      }
    });

    socket.on("stopTyping", (data) => {
      const { receiverId } = data;
      const receiverSocketId = connectedUsers.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userTyping", {
          userId: socket.userId,
          typing: false,
        });
      }
    });

    socket.on("markRead", async (data) => {
      try {
        const { messageIds, senderId } = data;

        // Update the messages as read in database
        // (This would be implemented in ChatService)

        // Notify the original sender that their message was read
        const senderSocketId = connectedUsers.get(senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit("messagesRead", {
            messageIds,
            readBy: socket.userId,
          });
        }
      } catch (error) {
        logger.error("Error marking messages as read:", error);
      }
    });

    socket.on("disconnect", async () => {
      try {
        if (socket.userId) {
          // Update user status to offline
          await User.findByIdAndUpdate(socket.userId, {
            status: "offline",
            lastSeen: new Date(),
          });

          // Remove from connected users map
          connectedUsers.delete(socket.userId);

          // Broadcast offline status to all clients
          io.emit("userStatus", { userId: socket.userId, status: "offline" });
        }
        logger.info(`User disconnected: ${socket.id}`);
      } catch (error) {
        logger.error("Error in disconnect event:", error);
      }
    });

    // Notification-related events
    socket.on("readNotification", async (notificationId) => {
      try {
        if (socket.userId) {
          await NotificationService.markAsRead(notificationId, socket.userId);

          // Send updated unread notification count
          const unreadCount = await NotificationService.getUnreadCount(
            socket.userId,
          );
          socket.emit("unreadCounts", {
            notifications: unreadCount,
          });
        }
      } catch (error) {
        logger.error("Error marking notification as read:", error);
      }
    });
  });
};
