"use server";

import { ai } from "@/lib/ai/gemini";
import { parseResumeAnalysis } from "@/lib/ai/response-parser";
import { type ResumeAnalysis } from "@/features/resume/types/resume.types";

export async function analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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

    return parseResumeAnalysis(response.text);
  } catch (error) {
    console.error("Resume analysis failed:", error);
    return {
      score: 0,
      strengths: [],
      weaknesses: [],
      suggestions: [],
      missingKeywords: [],
    };
  }
}