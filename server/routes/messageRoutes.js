import express from "express";
import {
  getMessagesByPictureId,
  createMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/:id/messages", getMessagesByPictureId);
router.post("/picture", createMessage);

export default router;
