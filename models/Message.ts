import mongoose, { Schema, model, models } from "mongoose";

export interface IMessage {
  _id?: string;
  chatId: mongoose.Types.ObjectId;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = models.Message || model<IMessage>("Message", MessageSchema);

export default Message;