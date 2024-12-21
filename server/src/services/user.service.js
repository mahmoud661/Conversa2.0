import { User } from '../models/user.model.js';

export class UserService {
  static async getUsers(currentUserId) {
    return User.find(
      { _id: { $ne: currentUserId } },
      '-password'
    ).sort({ name: 1 });
  }
}