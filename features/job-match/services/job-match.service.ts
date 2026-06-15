import { ai } from "@/lib/ai/gemini";
import { JOB_MATCH_ANALYSIS_PROMPT } from "@/lib/ai/prompts";
import { parseJobMatchResult } from "@/features/job-match/services/response-parser";
import type { JobMatchResult } from "@/features/job-match/types/job-match.types";

export async function analyzeJobMatch(
  resumeText: string,
  jobDescription: string
): Promise<JobMatchResult> {
  const prompt = JOB_MATCH_ANALYSIS_PROMPT
    .replace("{RESUME_TEXT}", resumeText)
    .replace("{JD_TEXT}", jobDescription);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return parseJobMatchResult(response.text);
}