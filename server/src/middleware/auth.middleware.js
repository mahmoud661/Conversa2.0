import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { User } from '../models/user.model.js';
import { AppError } from '../utils/app-error.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      throw new AppError('User not found', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(new AppError('Invalid token', 401));
  }
};