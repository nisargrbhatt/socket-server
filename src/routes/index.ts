import { Router } from "express";
import ChatRouter from "./chat.router";
import UserRouter from "./user.router";
import RoomRouter from "./room.router";

const router = Router();

router.use("chat/", ChatRouter);
router.use("room/", RoomRouter);
router.use("user/", UserRouter);

export default router;
