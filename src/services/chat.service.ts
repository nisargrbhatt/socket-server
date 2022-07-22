import { Chat } from "../models";

export class ChatService {
  get(_id: string) {
    return Chat.findById(_id);
  }

  create(data: any) {
    return Chat.create(data);
  }

  list() {
    return Chat.find();
  }

  delete(_id: string) {
    return Chat.findByIdAndDelete(_id);
  }

  getByRoomId(roomId: string) {
    return Chat.find({
      roomId,
    })
      .populate("senderId")
      .populate("receiverId");
  }
}
