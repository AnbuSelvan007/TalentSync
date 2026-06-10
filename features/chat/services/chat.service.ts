import { ai } from "@/lib/ai/gemini";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { buildConversationContext }
  from "@/lib/ai/context-manager";
interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function generateAIResponse(
  userMessage: string,
  messages: Message[]
) {
  try {
    const recentMessages =
      messages.slice(-10);

   const context =
  buildConversationContext(
    messages,
    userMessage
  );

    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
            ${SYSTEM_PROMPT}

            ${context}
            `,
        });

    return response.text;
  } catch (error) {
    console.error(error);

    return "TalentSync AI is currently unavailable. Please try again later.";
  }
}