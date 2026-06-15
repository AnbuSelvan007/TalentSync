"use client";

import { motion } from "framer-motion";
import { PieChart, TrendingUp } from "lucide-react";

interface Props {
  score: number;
}

function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Average";
  return "Poor";
}

function getScoreColor(score: number): string {
  if (score >= 90) return "text-emerald-500";
  if (score >= 70) return "text-blue-500";
  if (score >= 50) return "text-amber-500";
  return "text-red-500";
}

function getScoreBg(score: number): string {
  if (score >= 90) return "bg-emerald-500/10";
  if (score >= 70) return "bg-blue-500/10";
  if (score >= 50) return "bg-amber-500/10";
  return "bg-red-500/10";
}

function getScoreRing(score: number): string {
  if (score >= 90) return "stroke-emerald-500";
  if (score >= 70) return "stroke-blue-500";
  if (score >= 50) return "stroke-amber-500";
  return "stroke-red-500";
}

export default function MatchScoreCard({ score }: Props) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="rounded-3xl border bg-gradient-to-br from-primary/5 to-primary/10 p-6 shadow-sm transition-all hover:shadow-md dark:border-primary/30">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5">
          <PieChart className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Match Score</h3>
        <span
          className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ${getScoreBg(score)} ${getScoreColor(score)}`}
        >
          {getScoreLabel(score)}
        </span>
      </div>

      <div className="flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <svg width="140" height="140" className="-rotate-90">
            <circle
              cx="70"
              cy="70"
              r="54"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-muted/30"
            />
            <motion.circle
              cx="70"
              cy="70"
              r="54"
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              className={getScoreRing(score)}
              initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className={`text-3xl font-bold ${getScoreColor(score)}`}
            >
              {score}%
            </motion.span>
            <span className="text-xs text-muted-foreground">match</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <TrendingUp className="h-3.5 w-3.5" />
        <span>
          {score >= 70
            ? "Strong alignment with job requirements"
            : score >= 50
              ? "Moderate alignment — some gaps to address"
              : "Low alignment — consider skill development"}
        </span>
      </div>
    </div>
  );
}