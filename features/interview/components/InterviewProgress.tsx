"use client";

import { motion } from "framer-motion";

interface Props {
  current: number;
  total: number;
}

export default function InterviewProgress({ current, total }: Props) {
  const percent = total > 0 ? (current / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border bg-card/50 p-5 shadow-sm backdrop-blur dark:border-zinc-800"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Question {Math.min(current + 1, total)} of {total}
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          {Math.round(percent)}% Complete
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
        />
      </div>

      <div className="mt-3 flex justify-between">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-colors ${
              i < current
                ? "bg-primary"
                : i === current
                  ? "bg-primary/50"
                  : "bg-muted-foreground/20"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}