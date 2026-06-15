import type { Goal, SkillLevel, Timeline } from "@/features/roadmap/types/roadmap.types";

export interface RoadmapInput {
  goal: Goal;
  skillLevel: SkillLevel;
  timeline: Timeline;
}

export const roadmapInputSchema = {
  goal: { type: String, required: true, enum: ["Full Stack Developer", "Full Stack AI Engineer", "Frontend Developer", "Backend Developer", "Data Analyst"] },
  skillLevel: { type: String, required: true, enum: ["Beginner", "Intermediate", "Advanced"] },
  timeline: { type: String, required: true, enum: ["3 Months", "6 Months", "12 Months"] },
} as const;