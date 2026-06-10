"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { ROLES, EXPERIENCE_LEVELS, DIFFICULTIES, QUESTION_COUNTS } from "@/features/interview/constants/interview.constants";
import type { Role, ExperienceLevel, Difficulty } from "@/features/interview/types/interview.types";

interface Props {
  role: Role;
  experience: ExperienceLevel;
  difficulty: Difficulty;
  questionCount: number;
  onRoleChange: (v: Role) => void;
  onExperienceChange: (v: ExperienceLevel) => void;
  onDifficultyChange: (v: Difficulty) => void;
  onQuestionCountChange: (v: number) => void;
  onStart: () => void;
  disabled?: boolean;
}

export default function InterviewSetupCard({
  role,
  experience,
  difficulty,
  questionCount,
  onRoleChange,
  onExperienceChange,
  onDifficultyChange,
  onQuestionCountChange,
  onStart,
  disabled,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-3xl border bg-card/50 p-8 shadow-lg backdrop-blur transition-all hover:shadow-xl dark:border-zinc-800"
    >
      <h2 className="mb-6 text-xl font-semibold">Interview Setup</h2>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Role */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Role</label>
          <select
            value={role}
            onChange={(e) => onRoleChange(e.target.value as Role)}
            disabled={disabled}
            className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary disabled:opacity-50 dark:border-zinc-700"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Experience */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Experience</label>
          <select
            value={experience}
            onChange={(e) => onExperienceChange(e.target.value as ExperienceLevel)}
            disabled={disabled}
            className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary disabled:opacity-50 dark:border-zinc-700"
          >
            {EXPERIENCE_LEVELS.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
            disabled={disabled}
            className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary disabled:opacity-50 dark:border-zinc-700"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Question Count */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Questions</label>
          <div className="flex gap-2">
            {QUESTION_COUNTS.map((n) => (
              <button
                key={n}
                onClick={() => onQuestionCountChange(n)}
                disabled={disabled}
                className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all disabled:opacity-50
                  ${questionCount === n
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-transparent bg-muted hover:bg-muted/80"
                  }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        disabled={disabled}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 disabled:opacity-50"
      >
        <Play className="h-5 w-5" />
        Start Interview
      </motion.button>
    </motion.div>
  );
}