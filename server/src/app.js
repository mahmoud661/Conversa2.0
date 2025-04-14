import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config/config.js";
import { setupRoutes } from "./routes/index.js";
import { connectDB } from "./config/database.js";
import { setupSocket } from "./services/socket.service.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { logger } from "./config/logger.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.clientUrl,
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors({ origin: config.clientUrl }));
app.use(helmet());
app.use(express.json());

// Routes
setupRoutes(app);

// Socket.IO setup
setupSocket(io);

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    httpServer.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
  }
};

startServer();
