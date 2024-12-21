import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb+srv://mahmoudzuriqi8:11lZUdC38oUyYNok@cluster0.gdm6p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  env: process.env.NODE_ENV || 'development'
};