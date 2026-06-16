import { ai } from "@/lib/ai/gemini";
import { ROADMAP_GENERATION_PROMPT } from "@/lib/ai/prompts";
import type {
  Goal,
  SkillLevel,
  Timeline,
  RoadmapResult,
  RoadmapMonth,
} from "@/features/roadmap/types/roadmap.types";
import { TIMELINE_MONTHS } from "@/features/roadmap/constants/roadmap.constants";

export async function generateRoadmap(
  goal: Goal,
  skillLevel: SkillLevel,
  timeline: Timeline
): Promise<RoadmapResult> {
  // Extract month count from timeline string (e.g. "3 Months" → 3, "6 Months" → 6)
  const months = TIMELINE_MONTHS[timeline] ?? (() => {
    const match = timeline.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 3;
  })();

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

  // Enforce exact month count — trim if AI generated more, pad if fewer
  const targetMonths = months;
  let roadmapMonths: RoadmapMonth[] = [];

  if (Array.isArray(parsed.months)) {
    // Take only the exact number requested, renumber sequentially
    roadmapMonths = parsed.months.slice(0, targetMonths).map(
      (m: any, i: number) => ({
        ...m,
        month: i + 1,  // Ensure sequential month numbers
      })
    );
  }

  // If we got fewer months than requested (AI didn't generate enough), pad with generic cards
  while (roadmapMonths.length < targetMonths) {
    roadmapMonths.push({
      month: roadmapMonths.length + 1,
      title: `Month ${roadmapMonths.length + 1}`,
      topics: [],
    });
  }

  return {
    goal,
    skillLevel,
    timeline,
    months: roadmapMonths,
  };
}