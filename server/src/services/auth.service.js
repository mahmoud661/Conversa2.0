import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { config } from '../config/config.js';
import { AppError } from '../utils/app-error.js';

export class AuthService {
  static async register({ email, password, name }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const user = await User.create({
      email,
      password,
      name,
      avatar: `https://api.dicebear.com/7.x/avatars/svg?seed=${email}`
    });

    const token = this.generateToken(user._id);
    return { token, user: this.sanitizeUser(user) };
  }

  static async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = this.generateToken(user._id);
    return { token, user: this.sanitizeUser(user) };
  }

  static generateToken(userId) {
    return jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: '7d' });
  }

  static sanitizeUser(user) {
    const { password, ...sanitizedUser } = user.toObject();
    return sanitizedUser;
  }
}