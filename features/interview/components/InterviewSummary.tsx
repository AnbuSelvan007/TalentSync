"use client";

import { motion } from "framer-motion";
import { RotateCcw, Trophy, TrendingUp, TrendingDown, Lightbulb, Target } from "lucide-react";
import type { InterviewQuestion } from "@/features/interview/types/interview.types";

interface Props {
  questions: InterviewQuestion[];
  onRestart: () => void;
}

export default function InterviewSummary({ questions, onRestart }: Props) {
  const evaluated = questions.filter((q) => q.evaluation !== null);
  const totalScore = evaluated.reduce((sum, q) => sum + (q.evaluation?.score ?? 0), 0);
  const avgScore = evaluated.length > 0 ? (totalScore / evaluated.length).toFixed(1) : "0";
  const percentScore = evaluated.length > 0 ? Math.round((totalScore / (evaluated.length * 10)) * 100) : 0;

  const allStrengths = evaluated.flatMap((q) => q.evaluation?.strengths ?? []);
  const allWeaknesses = evaluated.flatMap((q) => q.evaluation?.weaknesses ?? []);

  const getLevel = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "text-emerald-500", bar: "bg-emerald-500" };
    if (score >= 60) return { label: "Good", color: "text-blue-500", bar: "bg-blue-500" };
    if (score >= 40) return { label: "Average", color: "text-amber-500", bar: "bg-amber-500" };
    return { label: "Needs Work", color: "text-red-500", bar: "bg-red-500" };
  };

  const level = getLevel(percentScore);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Overall Score Hero */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl border bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center shadow-sm dark:border-primary/20"
      >
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Trophy className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Interview Complete</h2>
        <p className="mt-1 text-muted-foreground">Here is your performance summary</p>

        <div className="mt-6 flex items-center justify-center gap-8">
          <div className="text-center">
            <p className={`text-5xl font-bold ${level.color}`}>{avgScore}</p>
            <p className="mt-1 text-xs text-muted-foreground">Average Score</p>
          </div>
          <div className="text-center">
            <p className={`text-5xl font-bold ${level.color}`}>{percentScore}%</p>
            <p className="mt-1 text-xs text-muted-foreground">Overall Rating</p>
          </div>
        </div>

        <div className="mx-auto mt-4 w-full max-w-xs">
          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentScore}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              className={`h-full rounded-full ${level.bar}`}
            />
          </div>
          <p className={`mt-2 text-sm font-medium ${level.color}`}>{level.label}</p>
        </div>
      </motion.div>

      {/* Performance Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl border bg-card/50 p-6 shadow-sm backdrop-blur dark:border-zinc-800"
      >
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <TrendingUp className="h-4 w-4 text-primary" />
          Per-Question Performance
        </h3>

        <div className="space-y-3">
          {questions.map((q, i) => {
            const s = q.evaluation?.score ?? 0;
            const w = (s / 10) * 100;
            const barColor =
              s >= 7 ? "bg-emerald-500" : s >= 4 ? "bg-amber-500" : "bg-red-500";
            return (
              <div key={q.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="truncate text-muted-foreground">Q{i + 1}</span>
                  <span className="font-medium">{s}/10</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${w}%` }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                    className={`h-full rounded-full ${barColor}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Strengths Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl border bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 p-6 shadow-sm dark:border-emerald-900/30"
        >
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <h3 className="font-semibold">Strengths</h3>
          </div>
          {allStrengths.length === 0 ? (
            <p className="text-sm text-muted-foreground">No common strengths identified.</p>
          ) : (
            <ul className="space-y-2">
              {Array.from(new Set(allStrengths)).slice(0, 6).map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* Areas for Improvement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl border bg-gradient-to-br from-red-500/5 to-orange-500/5 p-6 shadow-sm dark:border-red-900/30"
        >
          <div className="mb-4 flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold">Areas for Improvement</h3>
          </div>
          {allWeaknesses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No common weaknesses identified.</p>
          ) : (
            <ul className="space-y-2">
              {Array.from(new Set(allWeaknesses)).slice(0, 6).map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-3xl border bg-gradient-to-br from-blue-500/5 to-indigo-500/5 p-6 shadow-sm dark:border-blue-900/30"
      >
        <div className="mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold">Recommendations</h3>
        </div>
        <ul className="space-y-2">
          {[
            "Practice structuring answers using the STAR method (Situation, Task, Action, Result).",
            "Focus on improving weaker areas identified in your evaluations.",
            "Practice with more technical questions to build confidence.",
            "Review core concepts related to your target role.",
          ].map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
              <span className="text-muted-foreground">{rec}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Restart Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90"
        >
          <RotateCcw className="h-5 w-5" />
          Practice Again
        </motion.button>
      </motion.div>
    </motion.div>
  );
}