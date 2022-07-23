"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const models_1 = require("../models");
class ChatService {
    get(_id) {
        return models_1.Chat.findById(_id);
    }
    create(data) {
        return models_1.Chat.create(data);
    }
    list() {
        return models_1.Chat.find();
    }
    delete(_id) {
        return models_1.Chat.findByIdAndDelete(_id);
    }
    update(data, _id) {
        return models_1.Chat.updateOne({ _id }, data);
    }
    getByRoomId(roomId) {
        return models_1.Chat.find({
            roomId,
        })
            .populate("senderId")
            .populate("receiverId");
    }
}
exports.ChatService = ChatService;
