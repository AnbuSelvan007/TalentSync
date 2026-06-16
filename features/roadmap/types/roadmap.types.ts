export type Goal = string;

export type SkillLevel = string;

export type Timeline = string;

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