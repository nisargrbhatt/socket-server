"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const chat_controller_1 = require("../controllers/chat.controller");
const router = (0, express_1.Router)();
router.get("/getroomchats", auth_middleware_1.default, chat_controller_1.getRoomChats);
exports.default = router;
