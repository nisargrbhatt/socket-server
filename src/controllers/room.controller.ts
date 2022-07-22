import { Request, Response, NextFunction } from "express";
import { IRoom } from "../models";
import { RoomService } from "../services";

const roomService = new RoomService();

const createRoom = async (req: any, res: Response, next: NextFunction) => {
  const { member1, member2 } = req.body;

  let createdRoom;
  try {
    createdRoom = await roomService.create({
      member1Id: member1,
      member2Id: member2,
    });
  } catch (error) {
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
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }

  return res.status(201).json({
    message: "Room created successfully",
    data: {
      room: room?.toJSON(),
    },
  });
};

const getMyRooms = async (req: any, res: Response, next: NextFunction) => {
  const authUserData: { email: string; userId: string } = req.userData;

  if (!authUserData?.userId) {
    return res.status(400).json({
      message: "Bad Request",
    });
  }

  let rooms;
  try {
    rooms = await roomService.getUserRooms(authUserData.userId);
  } catch (error) {
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

export { createRoom, getMyRooms };
