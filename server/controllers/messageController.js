import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to get fresh messages data
const getMessagesData = () => {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/messages.json"), "utf8")
  );
};

export const getMessagesByPictureId = (req, res) => {
  const { id } = req.params;
  try {
    const messagesData = getMessagesData(); // Get fresh data
    const messages = messagesData.messages.filter(
      (message) => message.pictureId === parseInt(id)
    );
    res.json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching messages", error: error.message });
  }
};

export const createMessage = (req, res) => {
  try {
    const { pictureId, userName, content } = req.body;

    const newMessage = {
      id: uuidv4(),
      pictureId: parseInt(pictureId),
      userName,
      content,
    };

    messagesData.messages.push(newMessage);

    // Save to file
    fs.writeFileSync(
      path.join(__dirname, "../data/messages.json"),
      JSON.stringify(messagesData, null, 2)
    );

    res.status(201).json(newMessage);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating message", error: error.message });
  }
};
