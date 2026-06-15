"use client";

import { motion } from "framer-motion";
import { Sparkles, Wand2 } from "lucide-react";
import { GOALS, SKILL_LEVELS, TIMELINES } from "@/features/roadmap/constants/roadmap.constants";
import type { Goal, SkillLevel, Timeline } from "@/features/roadmap/types/roadmap.types";

interface Props {
  goal: Goal;
  skillLevel: SkillLevel;
  timeline: Timeline;
  onGoalChange: (v: Goal) => void;
  onSkillLevelChange: (v: SkillLevel) => void;
  onTimelineChange: (v: Timeline) => void;
  onGenerate: () => void;
  disabled?: boolean;
}

export default function GoalSelectionCard({
  goal,
  skillLevel,
  timeline,
  onGoalChange,
  onSkillLevelChange,
  onTimelineChange,
  onGenerate,
  disabled,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-3xl border bg-card/50 p-8 shadow-lg backdrop-blur transition-all hover:shadow-xl dark:border-zinc-800"
    >
      <h2 className="mb-6 text-xl font-semibold">Configure Your Roadmap</h2>

      <div className="grid gap-6 sm:grid-cols-3">
        {/* Goal */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Career Goal</label>
          <select
            value={goal}
            onChange={(e) => onGoalChange(e.target.value as Goal)}
            disabled={disabled}
            className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary disabled:opacity-50 dark:border-zinc-700"
          >
            {GOALS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Skill Level */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Current Skill Level</label>
          <select
            value={skillLevel}
            onChange={(e) => onSkillLevelChange(e.target.value as SkillLevel)}
            disabled={disabled}
            className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary disabled:opacity-50 dark:border-zinc-700"
          >
            {SKILL_LEVELS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Timeline</label>
          <select
            value={timeline}
            onChange={(e) => onTimelineChange(e.target.value as Timeline)}
            disabled={disabled}
            className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary disabled:opacity-50 dark:border-zinc-700"
          >
            {TIMELINES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onGenerate}
        disabled={disabled}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 disabled:opacity-50"
      >
        {disabled ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="h-5 w-5" />
            Generate Roadmap
          </>
        )}
      </motion.button>
    </motion.div>
  );
}