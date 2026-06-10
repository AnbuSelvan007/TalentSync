import { type ResumeAnalysis } from "@/features/resume/types/resume.types";

export function parseResumeAnalysis(text: string | null | undefined): ResumeAnalysis {
  if (!text) {
    return {
      score: 0,
      strengths: [],
      weaknesses: [],
      suggestions: [],
      missingKeywords: [],
    };
  }

  try {
    // Try to extract JSON from the response (it might be wrapped in markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    const parsed = JSON.parse(jsonStr);

    return {
      score: typeof parsed.score === "number" ? Math.min(100, Math.max(0, parsed.score)) : 0,
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
    };
  } catch {
    return {
      score: 0,
      strengths: [],
      weaknesses: [],
      suggestions: [],
      missingKeywords: [],
    };
  }
}