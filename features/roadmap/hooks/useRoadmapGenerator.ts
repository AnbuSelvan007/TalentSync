"use client";

import { useState } from "react";
import type {
  Goal,
  SkillLevel,
  Timeline,
  RoadmapResult,
  RoadmapPhase,
} from "@/features/roadmap/types/roadmap.types";

export function useRoadmapGenerator() {
  const [goal, setGoal] = useState<Goal>("Full Stack Developer");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("Beginner");
  const [timeline, setTimeline] = useState<Timeline>("3 Months");
  const [result, setResult] = useState<RoadmapResult | null>(null);
  const [phase, setPhase] = useState<RoadmapPhase>("setup");
  const [error, setError] = useState<string | null>(null);
  const [isLoadingLatest, setIsLoadingLatest] = useState(false);

  const loadLatest = async () => {
    setIsLoadingLatest(true);
    try {
      const res = await fetch("/api/roadmap/generate");
      const data = await res.json();
      if (data.result) {
        setResult(data.result.roadmap as RoadmapResult);
        setPhase("result");
      }
    } catch (err) {
      console.error("Failed to load latest roadmap:", err);
    } finally {
      setIsLoadingLatest(false);
    }
  };

  const generate = async () => {
    try {
      setPhase("generating");
      setError(null);

      const data = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, skillLevel, timeline }),
      }).then((r) => r.json());

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
    isLoadingLatest,
    setGoal,
    setSkillLevel,
    setTimeline,
    generate,
    loadLatest,
    reset,
  };
}