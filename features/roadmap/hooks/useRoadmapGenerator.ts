"use client";

import { useState } from "react";
import type {
  Goal,
  SkillLevel,
  Timeline,
  RoadmapResult,
  RoadmapPhase,
} from "@/features/roadmap/types/roadmap.types";
import { generateRoadmapAction } from "@/features/roadmap/actions/generate-roadmap";

export function useRoadmapGenerator() {
  const [goal, setGoal] = useState<Goal>("Full Stack Developer");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("Beginner");
  const [timeline, setTimeline] = useState<Timeline>("3 Months");
  const [result, setResult] = useState<RoadmapResult | null>(null);
  const [phase, setPhase] = useState<RoadmapPhase>("setup");
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    try {
      setPhase("generating");
      setError(null);

      const data = await generateRoadmapAction(goal, skillLevel, timeline);
      setResult(data);
      setPhase("result");
    } catch (err) {
      console.error("Failed to generate roadmap:", err);
      setError(err instanceof Error ? err.message : "Failed to generate roadmap");
      setPhase("error");
    }
  };

  const reset = () => {
    setResult(null);
    setPhase("setup");
    setError(null);
  };

  return {
    goal,
    skillLevel,
    timeline,
    result,
    phase,
    error,
    setGoal,
    setSkillLevel,
    setTimeline,
    generate,
    reset,
  };
}