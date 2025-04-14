import winston from 'winston';
import { config } from './config.js';

// Custom format for better error handling, especially for MongoDB errors
const mongoErrorFormat = winston.format((info) => {
  if (info.error instanceof Error) {
    info.errorDetails = {
      message: info.error.message,
      stack: info.error.stack,
    };
    
    // Handle MongoDB validation errors more gracefully
    if (info.error.name === 'ValidationError' || info.error.name === 'CastError') {
      info.mongoError = {
        name: info.error.name,
        path: info.error.path,
        value: info.error.value,
        kind: info.error.kind
      };
    }
  }
  return info;
});

export const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    mongoErrorFormat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        mongoErrorFormat(),
        winston.format.json()
      )
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        mongoErrorFormat(),
        winston.format.json()
      )
    })
  ]
});