"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomChats = void 0;
const services_1 = require("../services");
const chatService = new services_1.ChatService();
const getRoomChats = async (req, res, next) => {
    const roomId = req.query?.roomId;
    if (!roomId) {
        return res.status(400).json({
            message: "Bad Request",
        });
    }
    let chats;
    try {
        chats = await chatService.getByRoomId(roomId);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
    let jsonChats = chats.map((chat) => chat.toJSON());
    return res.status(200).json({
        message: "Chats fetched successfully",
        chats: jsonChats,
    });
};
exports.getRoomChats = getRoomChats;
