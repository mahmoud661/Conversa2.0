import { UserService } from '../services/user.service.js';

export class UserController {
  static async getUsers(req, res, next) {
    try {
      const users = await UserService.getUsers(req.user.id);
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
}