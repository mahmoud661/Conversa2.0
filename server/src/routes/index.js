import { Router } from 'express';
import { authRoutes } from './auth.routes.js';
import { chatRoutes } from './chat.routes.js';
import { userRoutes } from './user.routes.js';

export const setupRoutes = (app) => {
  const router = Router();

  router.use('/auth', authRoutes);
  router.use('/chat', chatRoutes);
  router.use('/users', userRoutes);

  app.use('/api', router);
};