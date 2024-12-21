import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/chat_app',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  env: process.env.NODE_ENV || 'development',
};