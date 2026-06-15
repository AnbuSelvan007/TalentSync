import type { Goal, SkillLevel, Timeline } from "@/features/roadmap/types/roadmap.types";

export const GOALS: Goal[] = [
  "Full Stack Developer",
  "Full Stack AI Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Data Analyst",
];

export const SKILL_LEVELS: SkillLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

export const TIMELINES: Timeline[] = ["3 Months", "6 Months", "12 Months"];

export const TIMELINE_MONTHS: Record<Timeline, number> = {
  "3 Months": 3,
  "6 Months": 6,
  "12 Months": 12,
};