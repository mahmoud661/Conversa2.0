import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

// Get users
router.get("/", UserController.getUsers);
router.get("/search", UserController.searchUsers);

// User profile
router.get("/profile", UserController.getUserProfile);
router.get("/profile/:id", UserController.getUserProfile);
router.patch("/profile", UserController.updateUserProfile);

// User security
router.patch("/password", UserController.updatePassword);

// User status and avatar
router.patch("/status", UserController.updateUserStatus);
router.patch("/avatar", UserController.updateUserAvatar);

export const userRoutes = router;
