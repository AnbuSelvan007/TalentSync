"use client";

import { motion } from "framer-motion";
import { CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { RoadmapMonth } from "@/features/roadmap/types/roadmap.types";
import ResourcesCard from "./ResourcesCard";

interface Props {
  month: RoadmapMonth;
  index: number;
}

export default function MonthCard({ month, index }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group rounded-3xl border bg-card/50 shadow-lg backdrop-blur transition-all hover:shadow-xl dark:border-zinc-800"
    >
      {/* Month Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
            {month.month}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-semibold">Month {month.month}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{month.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {month.topics.length} topics
          </span>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground transition-transform" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform" />
          )}
        </div>
      </button>

      {/* Expanded Topics */}
      <motion.div
        initial={false}
        animate={{
          height: expanded ? "auto" : 0,
          opacity: expanded ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="space-y-4 border-t px-6 py-5 dark:border-zinc-800">
          {month.topics.map((topic, topicIdx) => (
            <motion.div
              key={topic.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: topicIdx * 0.05 }}
              className="space-y-2"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {topicIdx + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{topic.name}</h4>
                  {topic.description && (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {topic.description}
                    </p>
                  )}
                  {topic.resources && topic.resources.length > 0 && (
                    <ResourcesCard resources={topic.resources} />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}