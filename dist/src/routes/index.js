"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_router_1 = __importDefault(require("./chat.router"));
const user_router_1 = __importDefault(require("./user.router"));
const room_router_1 = __importDefault(require("./room.router"));
const router = (0, express_1.Router)();
router.use("/chat", chat_router_1.default);
router.use("/room", room_router_1.default);
router.use("/user", user_router_1.default);
exports.default = router;
