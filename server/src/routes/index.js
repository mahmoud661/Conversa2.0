import { Router } from "express";
import { authRoutes } from "./auth.routes.js";
import { chatRoutes } from "./chat.routes.js";
import { userRoutes } from "./user.routes.js";
import notificationRoutes from "./notification.routes.js";

export const setupRoutes = (app) => {
  const router = Router();

  router.use("/auth", authRoutes);
  router.use("/chat", chatRoutes);
  router.use("/users", userRoutes);
  router.use("/notifications", notificationRoutes);

  app.use("/api", router);
};
