import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pictureRoutes from "./routes/pictureRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// check
app.get("/", (req, res) => {
  res.json({ message: "Server is alive ✅" });
});

// routes
app.use("/api/pictures", pictureRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
