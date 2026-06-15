import type { JobMatchResult } from "@/features/job-match/types/job-match.types";

export function parseJobMatchResult(text: string | null | undefined): JobMatchResult {
  if (!text) {
    return {
      matchScore: 0,
      matchingSkills: [],
      missingSkills: [],
      keywordsFound: [],
      keywordsMissing: [],
      suggestions: [],
    };
  }

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    const parsed = JSON.parse(jsonStr);

    return {
      matchScore: typeof parsed.matchScore === "number" ? Math.min(100, Math.max(0, parsed.matchScore)) : 0,
      matchingSkills: Array.isArray(parsed.matchingSkills) ? parsed.matchingSkills : [],
      missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
      keywordsFound: Array.isArray(parsed.keywordsFound) ? parsed.keywordsFound : [],
      keywordsMissing: Array.isArray(parsed.keywordsMissing) ? parsed.keywordsMissing : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
    };
  } catch {
    return {
      matchScore: 0,
      matchingSkills: [],
      missingSkills: [],
      keywordsFound: [],
      keywordsMissing: [],
      suggestions: [],
    };
  }
}