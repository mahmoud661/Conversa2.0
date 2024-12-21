import { logger } from '../config/logger.js';
import { AppError } from '../utils/app-error.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};