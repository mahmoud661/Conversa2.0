import { UserService } from "../services/user.service.js";
import { logger } from "../config/logger.js";

export class UserController {
  static async getUsers(req, res, next) {
    try {
      const users = await UserService.getUsers(req.user._id);

      res.status(200).json({
        status: "success",
        results: users.length,
        data: { users },
      });
    } catch (error) {
      logger.error("Error getting users:", error);
      next(error);
    }
  }

  static async getUserProfile(req, res, next) {
    try {
      const userId = req.params.id || req.user._id;
      const user = await UserService.getUserById(userId);

      res.status(200).json({
        status: "success",
        data: { user },
      });
    } catch (error) {
      logger.error(
        `Error getting user profile for ${req.params.id || "current user"}:`,
        error,
      );
      next(error);
    }
  }

  static async updateUserProfile(req, res, next) {
    try {
      const userId = req.user._id;
      const updateData = req.body;

      const user = await UserService.updateUserProfile(userId, updateData);

      res.status(200).json({
        status: "success",
        data: { user },
      });
    } catch (error) {
      logger.error("Error updating user profile:", error);
      next(error);
    }
  }

  static async updatePassword(req, res, next) {
    try {
      const userId = req.user._id;
      const { currentPassword, newPassword } = req.body;

      const result = await UserService.updatePassword(userId, {
        currentPassword,
        newPassword,
      });

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      logger.error("Error updating user password:", error);
      next(error);
    }
  }

  static async updateUserStatus(req, res, next) {
    try {
      const userId = req.user._id;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          status: "error",
          message: "Status is required",
        });
      }

      const user = await UserService.updateUserStatus(userId, status);

      res.status(200).json({
        status: "success",
        data: { user },
      });
    } catch (error) {
      logger.error("Error updating user status:", error);
      next(error);
    }
  }

  static async updateUserAvatar(req, res, next) {
    try {
      const userId = req.user._id;
      const { avatarUrl } = req.body;

      if (!avatarUrl) {
        return res.status(400).json({
          status: "error",
          message: "Avatar URL is required",
        });
      }

      const user = await UserService.updateUserAvatar(userId, avatarUrl);

      res.status(200).json({
        status: "success",
        data: { user },
      });
    } catch (error) {
      logger.error("Error updating user avatar:", error);
      next(error);
    }
  }

  static async searchUsers(req, res, next) {
    try {
      const { query } = req.query;
      const userId = req.user._id;

      const users = await UserService.searchUsers(query, userId);

      res.status(200).json({
        status: "success",
        results: users.length,
        data: { users },
      });
    } catch (error) {
      logger.error("Error searching users:", error);
      next(error);
    }
  }
}
