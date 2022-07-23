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

  getByMembersId(member1Id: string, member2Id: string) {
    return Room.findOne({
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
