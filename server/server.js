import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pictureRoutes from "./routes/pictureRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Server is alive ✅" });
});

// Pictures API routes
app.use("/api/pictures", pictureRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
