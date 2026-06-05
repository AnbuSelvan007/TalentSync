import { connectDB } from "@/lib/db/connection";

import Message from "@/models/Message";

export async function getMessages(
  chatId: string
) {
  await connectDB();

  return Message.find({
    chatId,
  }).sort({
    createdAt: 1,
  });
}