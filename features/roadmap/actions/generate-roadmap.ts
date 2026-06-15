"use server";

import type {
  Goal,
  SkillLevel,
  Timeline,
  RoadmapResult,
} from "@/features/roadmap/types/roadmap.types";
import { generateRoadmap } from "@/features/roadmap/services/roadmap.service";

export async function generateRoadmapAction(
  goal: Goal,
  skillLevel: SkillLevel,
  timeline: Timeline
): Promise<RoadmapResult> {
  return generateRoadmap(goal, skillLevel, timeline);
}