"use client";

import { motion } from "framer-motion";
import RoadmapHero from "@/features/roadmap/components/RoadmapHero";
import GoalSelectionCard from "@/features/roadmap/components/GoalSelectionCard";
import EmptyRoadmapState from "@/features/roadmap/components/EmptyRoadmapState";
import RoadmapTimeline from "@/features/roadmap/components/RoadmapTimeline";
import ErrorCard from "@/features/roadmap/components/ErrorCard";
import { useRoadmapGenerator } from "@/features/roadmap/hooks/useRoadmapGenerator";

export default function RoadmapPage() {
  const {
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
  } = useRoadmapGenerator();

  const isGenerating = phase === "generating";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-4xl space-y-8 px-4 py-8"
    >
      {/* Hero Section */}
      <RoadmapHero />

      {/* Configuration Card */}
      <GoalSelectionCard
        goal={goal}
        skillLevel={skillLevel}
        timeline={timeline}
        onGoalChange={setGoal}
        onSkillLevelChange={setSkillLevel}
        onTimelineChange={setTimeline}
        onGenerate={generate}
        disabled={isGenerating}
      />

      {/* Loading State */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-3xl border bg-card/30 px-8 py-16 shadow-lg backdrop-blur dark:border-zinc-800"
        >
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 animate-pulse rounded-full bg-primary/20" />
            </div>
          </div>
          <h3 className="mt-6 text-xl font-semibold">Generating Your Roadmap</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            AI is crafting a personalized learning path for you...
          </p>
        </motion.div>
      )}

      {/* Error State */}
      {phase === "error" && error && (
        <ErrorCard message={error} onRetry={generate} />
      )}

      {/* Result Timeline */}
      {phase === "result" && result && (
        <RoadmapTimeline months={result.months} />
      )}

      {/* Empty State */}
      {phase === "setup" && !result && <EmptyRoadmapState />}
    </motion.div>
  );
}