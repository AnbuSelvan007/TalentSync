export interface JobMatchResult {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  keywordsFound: string[];
  keywordsMissing: string[];
  suggestions: string[];
}

export type JobMatchPhase = "input" | "analyzing" | "result" | "error";