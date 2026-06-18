import { searchRelevantMemories } from "./embeddings";

interface MemoryResult {
  _id?: string;
  content: string;
  type: string;
  score: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

/**
 * Build a RAG-augmented prompt by:
 * 1. Embedding the current user message
 * 2. Retrieving top-5 relevant memories (scoped to userId, threshold >= 0.6)
 * 3. Combining system prompt + memories + recent history + current message
 */
export async function buildRAGContext(
  userId: string,
  currentMessage: string,
  recentMessages: Message[],
  systemPrompt: string
): Promise<string> {
  // Retrieve relevant memories (CRITICAL: scoped to userId, threshold >= 0.6)
  const memories = await searchRelevantMemories(userId, currentMessage, 5);

  // Format memories section
  const memoriesSection = formatMemories(memories);

  // Format recent history (last 10 messages, oldest first)
  const historySection = recentMessages
    .slice(-10)
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");

  // Build the full context prompt
  return `
${systemPrompt}

## RELEVANT MEMORIES FROM YOUR PROFILE

The following are memories retrieved from your career journey. Only include them if their relevance is high (score >= 0.6). Use them to provide personalized, context-aware responses.

${memoriesSection}

## RECENT CONVERSATION HISTORY

${historySection || "No previous conversation history."}

## CURRENT MESSAGE

User:
${currentMessage}

## INSTRUCTIONS

- Use the RELEVANT MEMORIES to personalize your response.
- If memories contain career goals, preferences, or past accomplishments, reference them naturally.
- If no relevant memories exist, respond based solely on the current message and history.
- Keep responses concise, practical, and actionable.
- Do NOT mention "according to your memories" — integrate the context naturally.
`;
}

/**
 * Format memory results into a readable string for the LLM context.
 */
function formatMemories(memories: MemoryResult[]): string {
  if (memories.length === 0) {
    return "No relevant memories found for this user.";
  }

  return memories
    .map((mem, i) => `${i + 1}. [${mem.type}] ${mem.content}`)
    .join("\n");
}