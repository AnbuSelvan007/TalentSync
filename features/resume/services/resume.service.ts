import { ai } from "@/lib/ai/gemini";

export async function analyzeResume(
  resumeText: string
) {
  const response =
    await ai.models.generateContent({
      model: "gemini-2.0-flash",

      contents: `
You are an ATS Resume Reviewer.

Return ONLY valid JSON.

Format:

{
  "score": number,
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "missingKeywords": []
}

Resume:

${resumeText}
`,
    });

  return response.text;
}