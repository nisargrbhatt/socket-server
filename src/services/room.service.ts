import { Room } from "../models";

export class RoomService {
  get(_id: string) {
    return Room.findById(_id).populate("member1Id").populate("member2Id");
  }

  create(data: any) {
    return Room.create(data);
  }

  list() {
    return Room.find();
  }

  delete(_id: string) {
    return Room.findByIdAndDelete(_id);
  }

  getUserRooms(userId: string) {
    return Room.find({
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
