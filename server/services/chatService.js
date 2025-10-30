import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ChatService {
  constructor() {
    this.rooms = new Map();
  }

  initialize(server) {
    this.wss = new WebSocketServer({ server });
    this.setupWebSocketServer();
  }

  setupWebSocketServer() {
    this.wss.on("connection", (ws) => this.handleConnection(ws));
  }

  handleConnection(ws) {
    console.log("Client connected");
    let clientPictureId = null;

    ws.on("message", (data) => this.handleMessage(ws, data, clientPictureId));
    ws.on("close", () => this.handleDisconnection(ws, clientPictureId));
    ws.on("error", (error) => this.handleError(ws, error));
  }

  async handleMessage(ws, data, clientPictureId) {
    try {
      const message = JSON.parse(data);

      switch (message.type) {
        case "join":
          this.handleJoinRoom(ws, message.pictureId);
          break;
        case "message":
          await this.handleChatMessage(ws, message);
          break;
        default:
          this.sendError(ws, "Unknown message type");
      }
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
      this.sendError(ws, "Failed to process message");
    }
  }

  handleJoinRoom(ws, pictureId) {
    if (!this.rooms.has(pictureId)) {
      this.rooms.set(pictureId, new Set());
    }
    this.rooms.get(pictureId).add(ws);
    ws.pictureId = pictureId; // track the room the client joined
    console.log(`Client joined room ${pictureId}`);
  }

  async handleChatMessage(ws, message) {
    const { pictureId, userName, content } = message;
    const newMessage = {
      id: uuidv4(),
      pictureId: parseInt(pictureId),
      userName,
      content,
    };

    try {
      await this.saveMessage(newMessage);
      this.broadcastToRoom(pictureId.toString(), newMessage);
      this.sendConfirmation(ws, newMessage);
    } catch (error) {
      console.error("Error handling chat message:", error);
      this.sendError(ws, "Failed to save message");
    }
  }

  async saveMessage(message) {
    const messagesPath = path.join(__dirname, "../data/messages.json");
    const messagesData = JSON.parse(fs.readFileSync(messagesPath, "utf8"));
    messagesData.messages.push(message);
    await fs.promises.writeFile(
      messagesPath,
      JSON.stringify(messagesData, null, 2)
    );
  }

  broadcastToRoom(roomId, message) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    }
  }

  sendConfirmation(ws, message) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "confirmation", message }));
    }
  }

  sendError(ws, errorMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "error", message: errorMessage }));
    }
  }

  handleDisconnection(ws, clientPictureId) {
    console.log("Client disconnected");
    if (ws.pictureId) {
      const room = this.rooms.get(ws.pictureId);
      if (room) {
        room.delete(ws);
        if (room.size === 0) {
          this.rooms.delete(ws.pictureId);
        }
      }
    }
  }

  handleError(ws, error) {
    console.error("WebSocket error:", error);
    this.sendError(ws, "Internal server error");
  }
}

export default new ChatService();
