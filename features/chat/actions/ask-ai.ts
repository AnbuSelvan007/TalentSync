"use server";

import { ai } from "@/lib/ai/gemini";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts";

export async function askAI(
  message: string
) {
  const response =
    await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
${SYSTEM_PROMPT}

User:
${message}
`,
    });

  return response.text;
}