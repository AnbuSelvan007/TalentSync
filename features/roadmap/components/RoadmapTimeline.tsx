"use client";

import { motion } from "framer-motion";
import { Route } from "lucide-react";
import type { RoadmapMonth } from "@/features/roadmap/types/roadmap.types";
import MonthCard from "./MonthCard";

interface Props {
  months: RoadmapMonth[];
}

export default function RoadmapTimeline({ months }: Props) {
  if (!months || months.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        <Route className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Your Learning Roadmap</h2>
        <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
          {months.length} months
        </span>
      </div>

      {/* Timeline Connector */}
      <div className="relative space-y-6 pl-2">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 h-full w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />

        {months.map((month, idx) => (
          <div key={month.month} className="relative">
            <MonthCard month={month} index={idx} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}