"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyRooms = exports.createRoom = void 0;
const services_1 = require("../services");
const roomService = new services_1.RoomService();
const createRoom = async (req, res, next) => {
    const { member1, member2 } = req.body;
    let existingRoom;
    try {
        existingRoom = await roomService.getByMembersId(member1, member2);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
    if (existingRoom) {
        return res.status(200).json({
            message: "Room already exist",
            data: {
                room: existingRoom.toJSON(),
                new: false,
            },
        });
    }
    let createdRoom;
    try {
        createdRoom = await roomService.create({
            member1Id: member1,
            member2Id: member2,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
    if (!createdRoom) {
        return res.status(400).json({
            message: "Bad Request",
        });
    }
    let room;
    try {
        room = await roomService.get(createdRoom._id.toString());
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
    return res.status(201).json({
        message: "Room created successfully",
        data: {
            room: room?.toJSON(),
            new: true,
        },
    });
};
exports.createRoom = createRoom;
const getMyRooms = async (req, res, next) => {
    const authUserData = req.userData;
    if (!authUserData?.userId) {
        return res.status(400).json({
            message: "Bad Request",
        });
    }
    let rooms;
    try {
        rooms = await roomService.getUserRooms(authUserData.userId);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
    let jsonRooms = rooms.map((room) => room.toJSON());
    return res.status(200).json({
        message: "Rooms fetched successfully",
        rooms: jsonRooms,
    });
};
exports.getMyRooms = getMyRooms;
