import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { config } from '../config/config.js';
import { AppError } from '../utils/app-error.js';
import { logger } from '../config/logger.js';

export class AuthService {
  static async register({ email, password, name }) {
    if (!email || !password || !name) {
      throw new AppError('Email, password, and name are required', 400);
    }

    try {
      // Check for existing user
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AppError('Email already registered', 400);
      }

      // Create user with proper error handling
      const user = await User.create({
        email,
        password,
        name,
        avatar: `https://api.dicebear.com/7.x/avatars/svg?seed=${email}`
      });

      logger.info(`User registered successfully: ${user._id} (${email})`);

      const token = this.generateToken(user._id);
      return { token, user: this.sanitizeUser(user) };
    } catch (error) {
      // Enhanced error handling
      logger.error('Registration error', { error, email });
      
      // Re-throw AppErrors directly
      if (error instanceof AppError) {
        throw error;
      }
      
      // If it's a validation error from Mongoose, handle it specifically
      if (error.name === 'ValidationError') {
        throw new AppError('Invalid user data: ' + Object.values(error.errors)
          .map(e => e.message)
          .join(', '), 400);
      }
      
      // For other errors, throw a generic message
      throw new AppError('Registration failed', 500);
    }
  }

  static async login({ email, password }) {
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

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