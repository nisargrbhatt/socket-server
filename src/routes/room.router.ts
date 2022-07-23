import { Router } from "express";
import auth from "../middlewares/auth.middleware";
import { createRoom, getMyRooms } from "../controllers/room.controller";

const router = Router();

router.post("/createroom", auth, createRoom);
router.get("/getmyrooms", auth, getMyRooms);

export default router;
