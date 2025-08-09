import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  createRoom,
  getOwnerRooms,
  getRooms,
  toggleAvailability,
} from "../controllers/roomController.js";
import upload from "../middlewares/multer.js";

const roomRouter = express.Router();

roomRouter.post("/", upload.array("images", 4), protect, createRoom);
roomRouter.get("/", protect, getRooms);
roomRouter.get("/owner", protect, getOwnerRooms);
roomRouter.post("/toggle-availability", protect, toggleAvailability);

export default roomRouter;
