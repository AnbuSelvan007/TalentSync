import { connectDB } from "@/lib/db/connection";
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import mongoose from "mongoose";

export async function createChat(userId: string, title: string = "New Chat") {
  await connectDB();
  return Chat.create({ userId: new mongoose.Types.ObjectId(userId), title });
}

export async function getUserChats(userId: string) {
  await connectDB();
  return Chat.find({ userId }).sort({ updatedAt: -1 }).lean();
}

export async function getChatById(chatId: string) {
  await connectDB();
  return Chat.findById(chatId).lean();
}

export async function updateChatTitle(chatId: string, title: string) {
  await connectDB();
  return Chat.findByIdAndUpdate(chatId, { title }, { new: true }).lean();
}

export async function deleteChat(chatId: string) {
  await connectDB();
  await Message.deleteMany({ chatId });
  return Chat.findByIdAndDelete(chatId).lean();
}

export async function getChatMessages(chatId: string) {
  await connectDB();
  return Message.find({ chatId }).sort({ createdAt: 1 }).lean();
}

export async function addMessage(chatId: string, role: "user" | "assistant", content: string) {
  await connectDB();
  await Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() });
  return Message.create({ chatId: new mongoose.Types.ObjectId(chatId), role, content });
}