import { Request, Response, NextFunction } from "express";
import { IChat } from "../models";
import { ChatService } from "../services";

const chatService = new ChatService();

const getRoomChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const roomId = req.query?.roomId as string;

  if (!roomId) {
    return res.status(400).json({
      message: "Bad Request",
    });
  }

  let chats;
  try {
    chats = await chatService.getByRoomId(roomId);
  } catch (error) {
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

export { getRoomChats };
