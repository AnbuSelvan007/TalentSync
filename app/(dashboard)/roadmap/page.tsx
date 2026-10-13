"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Download, Clock, FileText } from "lucide-react";
import RoadmapHero from "@/features/roadmap/components/RoadmapHero";
import GoalSelectionCard from "@/features/roadmap/components/GoalSelectionCard";
import EmptyRoadmapState from "@/features/roadmap/components/EmptyRoadmapState";
import RoadmapTimeline from "@/features/roadmap/components/RoadmapTimeline";
import ErrorCard from "@/features/roadmap/components/ErrorCard";
import { useRoadmapGenerator } from "@/features/roadmap/hooks/useRoadmapGenerator";
import PastResultBanner, { downloadAsPdf } from "@/components/shared/PastResultBanner";
import type { RoadmapMonth } from "@/features/roadmap/types/roadmap.types";

interface RoadmapHistoryItem {
  _id: string;
  goal: string;
  timeline: string;
  roadmap: { months: RoadmapMonth[] };
  createdAt: string;
}

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
    isLoadingLatest,
  } = useRoadmapGenerator();

  const [history, setHistory] = useState<RoadmapHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [viewingHistory, setViewingHistory] = useState<RoadmapHistoryItem | null>(null);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch("/api/roadmap/generate");
      const data = await res.json();
      setHistory(data.roadmaps || []);
    } catch (err) {
      console.error("Failed to load roadmap history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const isGenerating = phase === "generating";

  const handleDownload = (goalName: string, months: RoadmapMonth[], date?: string) => {
    const monthsHtml = months.map((m) => `
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
      `<p><strong>Goal:</strong> ${goalName}</p>`,
      date ? `<p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>` : "",
      ...monthsHtml,
    ].join("\n");
    downloadAsPdf(`Roadmap_${goalName.replace(/\s+/g, "_")}`, items);
  };

  const handleViewHistory = (item: RoadmapHistoryItem) => {
    setViewingHistory(item);
  };

  const handleCloseView = () => {
    setViewingHistory(null);
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      const res = await fetch(`/api/roadmap/generate?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setHistory((prev) => prev.filter((item) => item._id !== id));
      if (viewingHistory?._id === id) setViewingHistory(null);
    } catch (err) {
      console.error("Failed to delete roadmap:", err);
    }
  };

  // Auto-view latest result after generation
  useEffect(() => {
    if (result && history.length > 0) {
      // Reload history to pick up the new item
      loadHistory();
    }
  }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

  // If viewing a history item, show its timeline
  const displayMonths = viewingHistory
    ? (viewingHistory.roadmap?.months || [])
    : (phase === "result" && result ? result.months : []);

  const isShowingHistory = viewingHistory !== null && !result;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-4xl space-y-8 px-4 py-8"
    >
      <RoadmapHero />

      {/* History List Panel */}
      {history.length > 0 && !result && !isGenerating && !isShowingHistory && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border bg-card/50 p-6 shadow-sm backdrop-blur"
        >
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Clock className="h-4 w-4 text-primary" />
            Roadmap History ({history.length})
          </h3>
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3 transition-colors hover:bg-muted/50"
              >
                <button
                  onClick={() => handleViewHistory(item)}
                  className="flex items-center gap-3 min-w-0 flex-1 text-left"
                >
                  <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.goal}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.timeline} • {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </button>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    onClick={() => handleDownload(item.goal, item.roadmap?.months || [], item.createdAt)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteHistory(item._id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Viewing history item banner */}
      {isShowingHistory && viewingHistory && (
        <PastResultBanner
          title={`Viewing: ${viewingHistory.goal}`}
          subtitle={`${viewingHistory.timeline} • ${viewingHistory.roadmap?.months?.length || 0} months • ${new Date(viewingHistory.createdAt).toLocaleDateString()}`}
          onDownload={() => handleDownload(viewingHistory.goal, viewingHistory.roadmap?.months || [], viewingHistory.createdAt)}
        >
          <button
            onClick={handleCloseView}
            className="text-xs text-primary underline underline-offset-2 hover:text-primary/80"
          >
            Back to current
          </button>
        </PastResultBanner>
      )}

      {/* Configuration Card - hide when viewing history */}
      {!isShowingHistory && (
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
      )}

      {/* Loading State */}
      {isGenerating && !isShowingHistory && (
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
      {phase === "error" && error && !isShowingHistory && (
        <ErrorCard message={error} onRetry={generate} />
      )}

      {/* Result Timeline - show current result or history item */}
      {displayMonths.length > 0 && (
        <RoadmapTimeline months={displayMonths} />
      )}

      {/* Empty State */}
      {phase === "setup" && !result && !isLoadingHistory && !isLoadingLatest && history.length === 0 && (
        <EmptyRoadmapState />
      )}
    </motion.div>
  );
}