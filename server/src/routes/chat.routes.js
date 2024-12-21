import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/messages/:contactId', ChatController.getMessages);
router.get('/contacts', ChatController.getContacts);

export const chatRoutes = router;