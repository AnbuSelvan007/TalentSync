export interface ResumeAnalysis {
  score: number;

  strengths: string[];

  weaknesses: string[];

  suggestions: string[];

  missingKeywords: string[];
}