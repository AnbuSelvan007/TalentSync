"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { cleanMarkdown } from "@/lib/utils/format-text";

interface Props {
  strengths: string[];
}

export default function StrengthsCard({ strengths }: Props) {
  return (
    <div className="rounded-3xl border bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 p-6 shadow-sm transition-all hover:shadow-md dark:border-emerald-900/30">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-emerald-100 p-2.5 dark:bg-emerald-900/30">
          <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold">Strengths</h3>
        {strengths.length > 0 && (
          <span className="ml-auto rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            {strengths.length}
          </span>
        )}
      </div>

      {strengths.length === 0 ? (
        <p className="text-sm text-muted-foreground">No strengths identified.</p>
      ) : (
        <ul className="space-y-3">
          {strengths.map((item, i) => (
            <motion.li
              key={item + i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              <span className="text-sm leading-relaxed text-foreground/90">
                {cleanMarkdown(item)}
              </span>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}