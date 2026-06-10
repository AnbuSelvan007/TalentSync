import mongoose, {
  Schema,
  model,
  models,
} from "mongoose";

const ChatSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

const Chat =
  models.Chat ||
  model("Chat", ChatSchema);

export default Chat;