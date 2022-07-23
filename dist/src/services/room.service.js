"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const models_1 = require("../models");
class RoomService {
    get(_id) {
        return models_1.Room.findById(_id).populate("member1Id").populate("member2Id");
    }
    create(data) {
        return models_1.Room.create(data);
    }
    list() {
        return models_1.Room.find();
    }
    delete(_id) {
        return models_1.Room.findByIdAndDelete(_id);
    }
    getByMembersId(member1Id, member2Id) {
        return models_1.Room.findOne({
            $or: [
                {
                    member1Id: member1Id,
                    member2Id: member2Id,
                },
                {
                    member1Id: member2Id,
                    member2Id: member1Id,
                },
            ],
        })
            .populate("member1Id")
            .populate("member2Id");
    }
    getUserRooms(userId) {
        return models_1.Room.find({
            $or: [
                {
                    member1Id: userId,
                },
                {
                    member2Id: userId,
                },
            ],
        })
            .populate("member1Id")
            .populate("member2Id");
    }
}
exports.RoomService = RoomService;
