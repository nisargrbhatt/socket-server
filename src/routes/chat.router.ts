import { Router } from "express";
import auth from "../middlewares/auth.middleware";
import { getRoomChats } from "../controllers/chat.controller";

const router = Router();

router.get("/getroomchats", auth, getRoomChats);

export default router;
