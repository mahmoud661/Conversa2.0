import { logger } from '../config/logger.js';
import { AppError } from '../utils/app-error.js';
import mongoose from 'mongoose';

export const errorHandler = (err, req, res, next) => {
  // Log the error with enhanced details
  logger.error('Application error', { 
    error: err,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    user: req.user ? req.user.id : 'unauthenticated'
  });

  // Handle AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // Handle MongoDB validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors
    });
  }

  // Handle MongoDB cast errors (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      status: 'error',
      message: `Invalid ${err.path}: ${err.value}`,
      details: {
        field: err.path,
        value: err.value,
        kind: err.kind
      }
    });
  }

  // Handle duplicate key errors
  if (err.name === 'MongoServerError' && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    
    return res.status(409).json({
      status: 'error',
      message: `Duplicate value: "${value}" already exists for ${field}`
    });
  }

  // Default error response for unhandled errors
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};