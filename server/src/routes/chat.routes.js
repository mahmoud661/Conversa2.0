import { Router } from "express";
import { ChatController } from "../controllers/chat.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

// Messages routes
router.get("/messages/:contactId", ChatController.getMessages);
router.post("/messages", ChatController.sendMessage);
router.delete("/messages", ChatController.deleteMessages);
router.get("/messages/unread/count", ChatController.getUnreadCount);

// Contacts routes
router.get("/contacts", ChatController.getContacts);

// Recent chats (with latest message and unread count)
router.get("/recent", ChatController.getRecentChats);

export const chatRoutes = router;
