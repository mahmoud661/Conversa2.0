import { AuthService } from '../services/auth.service.js';
import { logger } from '../config/logger.js';

export class AuthController {
  static async register(req, res, next) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      console.log("login", req.body);
      const { token, user } = await AuthService.login(req.body);
      res.json({ token, user });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      res.json(req.user);
    } catch (error) {
      next(error);
    }
  }
}