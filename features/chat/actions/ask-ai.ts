"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import {
  addMessage,
  generateRAGResponse,
} from "@/services/chat.service";

/**
 * Server action to ask the AI with full RAG context.
 * Routes through the canonical RAG pipeline in services/chat.service.ts.
 */
export async function askAI(
  chatId: string,
  message: string
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  // Save user message
  await addMessage(chatId, userId, "user", message);

  // Generate RAG response
  const aiResponse = await generateRAGResponse(userId, chatId, message);

  // Save assistant message
  await addMessage(chatId, userId, "assistant", aiResponse);

  return aiResponse;
}