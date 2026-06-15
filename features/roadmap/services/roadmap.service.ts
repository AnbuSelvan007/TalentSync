import { ai } from "@/lib/ai/gemini";
import { ROADMAP_GENERATION_PROMPT } from "@/lib/ai/prompts";
import type {
  Goal,
  SkillLevel,
  Timeline,
  RoadmapResult,
} from "@/features/roadmap/types/roadmap.types";
import { TIMELINE_MONTHS } from "@/features/roadmap/constants/roadmap.constants";

export async function generateRoadmap(
  goal: Goal,
  skillLevel: SkillLevel,
  timeline: Timeline
): Promise<RoadmapResult> {
  const months = TIMELINE_MONTHS[timeline];

  const prompt = ROADMAP_GENERATION_PROMPT.replace("{GOAL}", goal)
    .replace("{SKILL_LEVEL}", skillLevel)
    .replace("{TIMELINE}", timeline)
    .replace("{MONTHS}", String(months));

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text;

  if (!text) {
    throw new Error("No response from AI");
  }

  // Clean the response - remove any markdown code fences if present
  const cleaned = text
    .replace(/```(?:json)?\s*/gi, "")
    .replace(/\s*```/g, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  return {
    goal,
    skillLevel,
    timeline,
    months: parsed.months,
  };
}