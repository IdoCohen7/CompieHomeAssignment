import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { fileURLToPath } from "url";
import path from "path";
import pictureRoutes from "./routes/pictureRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import chatService from "./services/chatService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// middlware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/pictures", pictureRoutes);
app.use("/api/messages", messageRoutes);

// create http server
const PORT = process.env.PORT || 3000;
const server = createServer(app);

// initialize websocket server
chatService.initialize(server);

// server start
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server is ready for connections`);
});
