export type Goal =
  | "Full Stack Developer"
  | "Full Stack AI Engineer"
  | "Frontend Developer"
  | "Backend Developer"
  | "Data Analyst";

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";

export type Timeline = "3 Months" | "6 Months" | "12 Months";

export interface RoadmapConfig {
  goal: Goal;
  skillLevel: SkillLevel;
  timeline: Timeline;
}

export interface RoadmapResource {
  title: string;
  url?: string;
  type: "video" | "article" | "practice" | "documentation";
}

export interface RoadmapTopic {
  name: string;
  description: string;
  resources: RoadmapResource[];
}

export interface RoadmapMonth {
  month: number;
  title: string;
  topics: RoadmapTopic[];
}

export interface RoadmapResult {
  goal: Goal;
  skillLevel: SkillLevel;
  timeline: Timeline;
  months: RoadmapMonth[];
}

export type RoadmapPhase = "setup" | "generating" | "result" | "error";