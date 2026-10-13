"use client";

import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";
import { PRESET_GOALS, PRESET_SKILL_LEVELS, PRESET_TIMELINES } from "@/features/roadmap/constants/roadmap.constants";

interface Props {
  goal: string;
  skillLevel: string;
  timeline: string;
  onGoalChange: (v: string) => void;
  onSkillLevelChange: (v: string) => void;
  onTimelineChange: (v: string) => void;
  onGenerate: () => void;
  disabled?: boolean;
}

interface SuggestionInputProps {
  value: string;
  onChange: (v: string) => void;
  suggestions: string[];
  label: string;
  disabled?: boolean;
  id: string;
}

function SuggestionInput({ value, onChange, suggestions, label, disabled, id }: SuggestionInputProps) {
  const datalistId = `${id}-suggestions`;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        list={datalistId}
        disabled={disabled}
        placeholder="Type or select..."
        className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary disabled:opacity-50 dark:border-zinc-700"
      />
      <datalist id={datalistId}>
        {suggestions.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </div>
  );
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
        <SuggestionInput
          id="goal"
          value={goal}
          onChange={onGoalChange}
          suggestions={PRESET_GOALS}
          label="Career Goal"
          disabled={disabled}
        />

        <SuggestionInput
          id="skill-level"
          value={skillLevel}
          onChange={onSkillLevelChange}
          suggestions={PRESET_SKILL_LEVELS}
          label="Current Skill Level"
          disabled={disabled}
        />

        <SuggestionInput
          id="timeline"
          value={timeline}
          onChange={onTimelineChange}
          suggestions={PRESET_TIMELINES}
          label="Timeline"
          disabled={disabled}
        />
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