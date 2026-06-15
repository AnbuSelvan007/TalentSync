import { ai } from "@/lib/ai/gemini";
import { COVER_LETTER_PROMPT } from "@/lib/ai/prompts";
import type { ApplicantInfo } from "@/features/cover-letter/types/cover-letter.types";

export async function generateCoverLetter(
  applicant: ApplicantInfo,
  resumeText: string,
  jobDescription: string
): Promise<string> {
  const prompt = COVER_LETTER_PROMPT
    .replace("{FULL_NAME}", applicant.fullName)
    .replace("{ROLE}", applicant.role)
    .replace("{COMPANY}", applicant.company)
    .replace("{EXPERIENCE}", applicant.experience)
    .replace("{RESUME_TEXT}", resumeText)
    .replace("{JD_TEXT}", jobDescription);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  return response.text.trim();
}