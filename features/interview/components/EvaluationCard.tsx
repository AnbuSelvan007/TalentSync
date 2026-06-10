"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Lightbulb, Star } from "lucide-react";
import type { QuestionEvaluation } from "@/features/interview/types/interview.types";

interface Props {
  evaluation: QuestionEvaluation;
}

export default function EvaluationCard({ evaluation }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Score */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="rounded-3xl border bg-gradient-to-br from-amber-500/5 to-yellow-500/5 p-6 shadow-sm dark:border-amber-900/30"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-amber-100 p-3 dark:bg-amber-900/30">
            <Star className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-3xl font-bold">
              {evaluation.score}
              <span className="text-lg font-normal text-muted-foreground">/10</span>
            </p>
          </div>
          <div className="ml-auto">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                evaluation.score >= 7
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : evaluation.score >= 4
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {evaluation.score >= 7 ? "Good" : evaluation.score >= 4 ? "Average" : "Needs Work"}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Strengths */}
        <div className="rounded-3xl border bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 p-5 shadow-sm dark:border-emerald-900/30">
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <h4 className="text-sm font-semibold">Strengths</h4>
          </div>
          {evaluation.strengths.length === 0 ? (
            <p className="text-xs text-muted-foreground">None identified</p>
          ) : (
            <ul className="space-y-2">
              {evaluation.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Weaknesses */}
        <div className="rounded-3xl border bg-gradient-to-br from-red-500/5 to-orange-500/5 p-5 shadow-sm dark:border-red-900/30">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <h4 className="text-sm font-semibold">Weaknesses</h4>
          </div>
          {evaluation.weaknesses.length === 0 ? (
            <p className="text-xs text-muted-foreground">None identified</p>
          ) : (
            <ul className="space-y-2">
              {evaluation.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Suggested Answer */}
      <div className="rounded-3xl border bg-gradient-to-br from-blue-500/5 to-indigo-500/5 p-5 shadow-sm dark:border-blue-900/30">
        <div className="mb-3 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-blue-500" />
          <h4 className="text-sm font-semibold">Suggested Answer</h4>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {evaluation.suggestedAnswer}
        </p>
      </div>
    </motion.div>
  );
}