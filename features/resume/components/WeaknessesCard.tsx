"use client";

import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { cleanMarkdown } from "@/lib/utils/format-text";

interface Props {
  weaknesses: string[];
}

export default function WeaknessesCard({ weaknesses }: Props) {
  return (
    <div className="rounded-3xl border bg-gradient-to-br from-red-500/5 to-orange-500/5 p-6 shadow-sm transition-all hover:shadow-md dark:border-red-900/30">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-red-100 p-2.5 dark:bg-red-900/30">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-semibold">Weaknesses</h3>
        {weaknesses.length > 0 && (
          <span className="ml-auto rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {weaknesses.length}
          </span>
        )}
      </div>

      {weaknesses.length === 0 ? (
        <p className="text-sm text-muted-foreground">No weaknesses identified.</p>
      ) : (
        <ul className="space-y-3">
          {weaknesses.map((item, i) => (
            <motion.li
              key={item + i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
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