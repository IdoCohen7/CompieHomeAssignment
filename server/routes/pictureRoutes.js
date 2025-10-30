import express from "express";
import {
  getPictures,
  getPictureById,
} from "../controllers/pictureController.js";

const router = express.Router();

router.get("/", getPictures);
router.get("/:id", getPictureById);

export default router;
