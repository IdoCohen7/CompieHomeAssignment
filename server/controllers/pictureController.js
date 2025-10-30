import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const picturesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/pictures.json"), "utf8")
);

export const getPictures = (req, res) => {
  try {
    res.json(picturesData.pictures);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pictures", error: error.message });
  }
};

export const getPictureById = (req, res) => {
  try {
    const picture = picturesData.pictures.find(
      (p) => p.id === parseInt(req.params.id)
    );
    if (!picture) {
      return res.status(404).json({ message: "Picture not found" });
    }
    res.json(picture);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching picture", error: error.message });
  }
};
