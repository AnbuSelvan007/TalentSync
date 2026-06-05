import { ai } from "@/lib/ai/gemini";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts";

export async function generateAIResponse(
  userMessage: string
) {
    try{
        const response =
            await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
        ${SYSTEM_PROMPT}

        User:
        ${userMessage}
        `,
            });

        return response.text;
   } catch (error) {
        console.error("Error generating AI response:", error);
        return "TalentSync AI is currently unavailable. Please try again later.";
  }
}