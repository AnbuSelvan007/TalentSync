"use server";

import { connectDB } from "@/lib/db/connection";

import Chat from "@/models/Chat";

export async function createChat(
  userId: string
) {
  await connectDB();

  const chat = await Chat.create({
    userId,
    title: "New Chat",
  });

  return chat;
}