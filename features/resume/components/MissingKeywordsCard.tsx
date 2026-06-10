"use client";

import { motion } from "framer-motion";
import { Tags, XCircle } from "lucide-react";
import { cleanMarkdown } from "@/lib/utils/format-text";

interface Props {
  missingKeywords: string[];
}

export default function MissingKeywordsCard({ missingKeywords }: Props) {
  return (
    <div className="rounded-3xl border bg-gradient-to-br from-violet-500/5 to-purple-500/5 p-6 shadow-sm transition-all hover:shadow-md dark:border-violet-900/30">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-violet-100 p-2.5 dark:bg-violet-900/30">
          <Tags className="h-5 w-5 text-violet-600 dark:text-violet-400" />
        </div>
        <h3 className="text-lg font-semibold">Missing Keywords</h3>
        {missingKeywords.length > 0 && (
          <span className="ml-auto rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
            {missingKeywords.length}
          </span>
        )}
      </div>

      {missingKeywords.length === 0 ? (
        <p className="text-sm text-muted-foreground">No missing keywords found.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {missingKeywords.map((keyword, i) => (
            <motion.span
              key={keyword + i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1.5 text-sm font-medium text-violet-700 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300"
            >
              <XCircle className="h-3.5 w-3.5 text-violet-400" />
              {cleanMarkdown(keyword)}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
}