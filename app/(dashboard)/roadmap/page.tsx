"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import RoadmapHero from "@/features/roadmap/components/RoadmapHero";
import GoalSelectionCard from "@/features/roadmap/components/GoalSelectionCard";
import EmptyRoadmapState from "@/features/roadmap/components/EmptyRoadmapState";
import RoadmapTimeline from "@/features/roadmap/components/RoadmapTimeline";
import ErrorCard from "@/features/roadmap/components/ErrorCard";
import { useRoadmapGenerator } from "@/features/roadmap/hooks/useRoadmapGenerator";
import PastResultBanner, { downloadAsPdf } from "@/components/shared/PastResultBanner";
import type { RoadmapMonth } from "@/features/roadmap/types/roadmap.types";

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
    loadLatest,
    isLoadingLatest,
  } = useRoadmapGenerator();

  const [storedResult, setStoredResult] = useState<{
    goal: string;
    timeline: string;
    months: RoadmapMonth[];
    createdAt?: string;
  } | null>(null);

  // Load latest stored result on mount
  useEffect(() => {
    loadLatest();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Check for stored result separately for the banner
  useEffect(() => {
    if (!result && phase === "setup") {
      fetch("/api/roadmap/generate")
        .then((res) => res.json())
        .then((data) => {
          if (data.result?.roadmap?.months?.length > 0) {
            setStoredResult({
              goal: data.result.goal,
              timeline: data.result.timeline,
              months: data.result.roadmap.months,
              createdAt: data.result.createdAt,
            });
          }
        })
        .catch(() => {});
    }
  }, [result, phase]);

  const isGenerating = phase === "generating";

  const handleDownload = () => {
    const data = storedResult || (result ? { goal, timeline: timeline, months: result.months } : null);
    if (!data) return;
    const monthsHtml = data.months.map((m) => `
      <div class="month-card">
        <h3>Month ${m.month}: ${m.title}</h3>
        ${m.topics.map((t) => `
          <div class="topic">
            <strong>${t.name}</strong> — ${t.description}
          </div>
        `).join("")}
      </div>
    `).join("\n");
    const items = [
      `<h1>Learning Roadmap</h1>`,
      `<p><strong>Goal:</strong> ${data.goal}</p>`,
      `<p><strong>Timeline:</strong> ${data.timeline}</p>`,
      data.createdAt ? `<p><strong>Date:</strong> ${new Date(data.createdAt).toLocaleDateString()}</p>` : "",
      ...monthsHtml,
    ].join("\n");
    downloadAsPdf(`Roadmap_${(data.goal || "goal").replace(/\s+/g, "_")}`, items);
  };

  const handleDismiss = () => {
    setStoredResult(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-4xl space-y-8 px-4 py-8"
    >
      {/* Hero Section */}
      <RoadmapHero />

      {/* Past Result Banner */}
      {storedResult && !result && !isGenerating && (
        <PastResultBanner
          title={`Learning Roadmap — ${storedResult.goal}`}
          subtitle={`${storedResult.timeline} • ${storedResult.months.length} months`}
          onDownload={handleDownload}
        >
          <div className="flex gap-2">
            <button
              onClick={() => {
                setStoredResult(null);
                reset();
              }}
              className="text-xs text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Generate new roadmap
            </button>
            <span className="text-xs text-muted-foreground">·</span>
            <button
              onClick={handleDismiss}
              className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Dismiss
            </button>
          </div>
        </PastResultBanner>
      )}

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
      {phase === "setup" && !result && !storedResult && !isLoadingLatest && <EmptyRoadmapState />}
    </motion.div>
  );
}