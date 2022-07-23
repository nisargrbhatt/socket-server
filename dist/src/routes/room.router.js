"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const room_controller_1 = require("../controllers/room.controller");
const router = (0, express_1.Router)();
router.post("/createroom", auth_middleware_1.default, room_controller_1.createRoom);
router.get("/getmyrooms", auth_middleware_1.default, room_controller_1.getMyRooms);
exports.default = router;
