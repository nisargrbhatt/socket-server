import { Schema, model, Types, Document } from "mongoose";

interface IRoom extends Document {
  _id: Types.ObjectId;
  // roomId: string;
  member1Id: Types.ObjectId | any;
  member2Id: Types.ObjectId | any;
  createdAt: number;
  updatedAt: number;
}

const roomSchema = new Schema<IRoom>(
  {
    // roomId: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    member1Id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    member2Id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Room = model("Room", roomSchema);

export { Room, IRoom };
