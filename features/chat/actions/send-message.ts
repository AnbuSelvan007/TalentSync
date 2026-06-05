"use server";

import { connectDB } from "@/lib/db/connection";

import Message from "@/models/Message";

export async function sendMessage(
  chatId: string,
  content: string
) {
  await connectDB();

  return Message.create({
    chatId,
    role: "user",
    content,
  });
}