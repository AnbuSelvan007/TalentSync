import mongoose, { Schema, model, models } from "mongoose";

export interface IChat {
  _id?: string;
  userId: mongoose.Types.ObjectId;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "New Chat",
    },
  },
  {
    timestamps: true,
  }
);

const Chat = models.Chat || model<IChat>("Chat", ChatSchema);

export default Chat;