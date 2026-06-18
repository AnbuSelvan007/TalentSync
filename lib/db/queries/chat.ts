import { connectDB } from "@/lib/db/connection";
import Message from "@/models/Message";
import { assertChatOwnership } from "@/services/chat.service";
import mongoose from "mongoose";

export async function getMessages(chatId: string, userId: string) {
  await connectDB();
  await assertChatOwnership(chatId, userId);

  return Message.find({
    chatId: new mongoose.Types.ObjectId(chatId),
  }).sort({
    createdAt: 1,
  });
}
