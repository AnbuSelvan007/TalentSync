"use client";

import { motion } from "framer-motion";
import { Lightbulb, ArrowRight } from "lucide-react";

interface Props {
  suggestions: string[];
}

export default function ImprovementSuggestionsCard({ suggestions }: Props) {
  return (
    <div className="rounded-3xl border bg-gradient-to-br from-amber-500/5 to-yellow-500/5 p-6 shadow-sm transition-all hover:shadow-md dark:border-amber-900/30">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-amber-100 p-2.5 dark:bg-amber-900/30">
          <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <h3 className="text-lg font-semibold">Improvement Suggestions</h3>
        {suggestions.length > 0 && (
          <span className="ml-auto rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            {suggestions.length}
          </span>
        )}
      </div>

      {suggestions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No suggestions available.</p>
      ) : (
        <ul className="space-y-3">
          {suggestions.map((suggestion, i) => (
            <motion.li
              key={suggestion + i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3"
            >
              <ArrowRight className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <span className="text-sm leading-relaxed text-foreground/90">{suggestion}</span>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}