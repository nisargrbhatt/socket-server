import { model, Schema, Document, Types } from "mongoose";

interface IChat extends Document {
  _id: Types.ObjectId;
  senderId: Types.ObjectId | any;
  receiverId: Types.ObjectId | any;
  message: string;
  roomId: Types.ObjectId | any;
  createdAt: number;
  updatedAt: number;
}

const chatSchema = new Schema<IChat>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = model("Chat", chatSchema);

export { IChat, Chat };
