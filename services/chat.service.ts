import { connectDB } from "@/lib/db/connection";
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import mongoose from "mongoose";
import { ai } from "@/lib/ai/gemini";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { buildRAGContext } from "@/lib/ai/context-builder";
import { storeMemory } from "@/lib/ai/embeddings";

function toObjectId(id: string) {
  return new mongoose.Types.ObjectId(id);
}

export class ChatAccessError extends Error {
  constructor(message = "Chat not found or access denied") {
    super(message);
    this.name = "ChatAccessError";
  }
}

export async function createChat(userId: string, title: string = "New Chat") {
  await connectDB();
  return Chat.create({ userId: toObjectId(userId), title });
}

export async function getUserChats(userId: string) {
  await connectDB();
  return Chat.find({ userId: toObjectId(userId) }).sort({ updatedAt: -1 }).lean();
}

export async function getChatForUser(chatId: string, userId: string) {
  await connectDB();
  return Chat.findOne({
    _id: toObjectId(chatId),
    userId: toObjectId(userId),
  }).lean();
}

export async function assertChatOwnership(chatId: string, userId: string) {
  const chat = await getChatForUser(chatId, userId);
  if (!chat) {
    throw new ChatAccessError();
  }
  return chat;
}

export async function getChatById(chatId: string) {
  await connectDB();
  return Chat.findById(chatId).lean();
}

export async function updateChatTitle(chatId: string, userId: string, title: string) {
  await connectDB();
  const chat = await Chat.findOneAndUpdate(
    { _id: toObjectId(chatId), userId: toObjectId(userId) },
    { title },
    { new: true }
  ).lean();

  if (!chat) {
    throw new ChatAccessError();
  }

  return chat;
}

export async function deleteChat(chatId: string, userId: string) {
  await connectDB();
  const chat = await Chat.findOneAndDelete({
    _id: toObjectId(chatId),
    userId: toObjectId(userId),
  }).lean();

  if (!chat) {
    throw new ChatAccessError();
  }

  await Message.deleteMany({ chatId: toObjectId(chatId) });
  return chat;
}

export async function getChatMessages(chatId: string, userId: string) {
  await assertChatOwnership(chatId, userId);

  return Message.find({ chatId: toObjectId(chatId) })
    .sort({ createdAt: 1 })
    .lean();
}

export async function getUserChatsWithMessages(userId: string) {
  await connectDB();

  const chats = await Chat.find({ userId: toObjectId(userId) })
    .sort({ updatedAt: -1 })
    .lean();

  if (chats.length === 0) {
    return [];
  }

  const chatIds = chats.map((chat) => chat._id);
  const messages = await Message.find({ chatId: { $in: chatIds } })
    .sort({ createdAt: 1 })
    .lean();

  const messagesByChatId = new Map<string, typeof messages>();
  for (const message of messages) {
    const key = message.chatId.toString();
    const existing = messagesByChatId.get(key) ?? [];
    existing.push(message);
    messagesByChatId.set(key, existing);
  }

  return chats.map((chat) => ({
    id: chat._id!.toString(),
    title: chat.title,
    messages: (messagesByChatId.get(chat._id!.toString()) ?? []).map((message) => ({
      id: message._id!.toString(),
      role: message.role as "user" | "assistant",
      content: message.content,
      createdAt: message.createdAt?.toISOString() ?? new Date().toISOString(),
    })),
  }));
}

export async function addMessage(
  chatId: string,
  userId: string,
  role: "user" | "assistant",
  content: string
) {
  await assertChatOwnership(chatId, userId);

  await Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() });
  return Message.create({
    chatId: toObjectId(chatId),
    role,
    content,
  });
}

/**
 * Generate an AI response with RAG (Retrieval-Augmented Generation).
 * Retrieves relevant memories scoped to the user, builds context, and generates a response.
 * Also stores the user message as a memory for future personalization (fire-and-forget).
 */
export async function generateRAGResponse(
  userId: string,
  chatId: string,
  userMessage: string
) {
  // Step 1: Fetch recent messages AND assert ownership in parallel
  const [recentMessages] = await Promise.all([
    Message.find({ chatId: toObjectId(chatId) })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
    assertChatOwnership(chatId, userId),
  ]);

  const history = recentMessages
    .reverse()
    .map((msg) => ({ role: msg.role as "user" | "assistant", content: msg.content }));

  const fullPrompt = await buildRAGContext(
    userId,
    userMessage,
    history,
    SYSTEM_PROMPT
  );

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: fullPrompt,
  });

  const aiResponseText = response.text || "";

  // Fire-and-forget: store memory in background, don't block the response
  storeMemory(userId, userMessage, "chat_memory", {
    chatId,
    messageType: "user_query",
  }).catch((error) => {
    console.error("[ChatService] Failed to store memory:", error);
  });

  return aiResponseText;
}
