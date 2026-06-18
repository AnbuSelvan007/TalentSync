import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import {
  addMessage,
  generateRAGResponse,
} from "@/services/chat.service";

/**
 * Generate an AI response using the canonical RAG pipeline.
 * This is a thin wrapper around services/chat.service.ts that
 * adds session-based authentication.
 *
 * @deprecated Use `askAI` from `@/features/chat/actions/ask-ai` instead.
 * This function exists for backward compatibility.
 */
export async function generateAIResponse(
  chatId: string,
  userMessage: string
): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  // Save user message
  await addMessage(chatId, userId, "user", userMessage);

  // Generate with full RAG
  const aiResponse = await generateRAGResponse(userId, chatId, userMessage);

  // Save assistant message
  await addMessage(chatId, userId, "assistant", aiResponse);

  return aiResponse;
}
