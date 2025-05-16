import { User } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import mongoose from "mongoose";

export class UserService {
  static async getUsers(currentUserId) {
    return User.find({ _id: { $ne: currentUserId } }, "-password").sort({
      name: 1,
    });
  }

  static async getUserById(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid user ID format", 400);
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  static async updateUserProfile(userId, updateData) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid user ID format", 400);
    }

    // Disallow updating certain sensitive fields
    const { password, ...safeUpdateData } = updateData;

    // Validate and sanitize update data
    if (Object.keys(safeUpdateData).length === 0) {
      throw new AppError("No valid fields to update", 400);
    }

    // Check if email update is requested and verify it's not already taken
    if (safeUpdateData.email) {
      const existingUser = await User.findOne({
        email: safeUpdateData.email,
        _id: { $ne: userId },
      });

      if (existingUser) {
        throw new AppError("Email is already in use", 400);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, safeUpdateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }

    return updatedUser;
  }

  static async updatePassword(userId, { currentPassword, newPassword }) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid user ID format", 400);
    }

    if (!currentPassword || !newPassword) {
      throw new AppError("Current password and new password are required", 400);
    }

    // Find user with password field
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new AppError("Current password is incorrect", 401);
    }

    // Update password (the pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    return { message: "Password updated successfully" };
  }

  static async updateUserStatus(userId, status) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid user ID format", 400);
    }

    const validStatuses = ["online", "offline", "away"];
    if (!validStatuses.includes(status)) {
      throw new AppError(
        "Invalid status. Must be online, offline, or away",
        400,
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        status,
        lastSeen: status === "offline" ? new Date() : undefined,
      },
      { new: true },
    ).select("-password");

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }

    return updatedUser;
  }

  static async updateUserAvatar(userId, avatarUrl) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid user ID format", 400);
    }

    if (!avatarUrl) {
      throw new AppError("Avatar URL is required", 400);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true },
    ).select("-password");

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }

    return updatedUser;
  }

  static async searchUsers(query, currentUserId) {
    if (!query || query.trim() === "") {
      return this.getUsers(currentUserId);
    }

    return User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        },
      ],
    })
      .select("-password")
      .sort({ name: 1 })
      .limit(20);
  }
}
