"use client";

import { motion } from "framer-motion";
import { Tags, CheckCircle2, XCircle } from "lucide-react";

interface Props {
  keywordsFound?: string[];
  keywordsMissing?: string[];
}

export default function KeywordAnalysisCard({ keywordsFound = [], keywordsMissing = [] }: Props) {
  return (
    <div className="rounded-3xl border bg-gradient-to-br from-violet-500/5 to-purple-500/5 p-6 shadow-sm transition-all hover:shadow-md dark:border-violet-900/30">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-violet-100 p-2.5 dark:bg-violet-900/30">
          <Tags className="h-5 w-5 text-violet-600 dark:text-violet-400" />
        </div>
        <h3 className="text-lg font-semibold">Keyword Analysis</h3>
      </div>

      {/* Keywords Found */}
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span className="text-sm font-medium">Found ({keywordsFound.length})</span>
        </div>
        {keywordsFound.length === 0 ? (
          <p className="text-sm text-muted-foreground">No ATS keywords found in resume.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {keywordsFound.map((kw, i) => (
              <motion.span
                key={kw + i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
              >
                <CheckCircle2 className="h-3 w-3" />
                {kw}
              </motion.span>
            ))}
          </div>
        )}
      </div>

      {/* Keywords Missing */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <XCircle className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium">Missing ({keywordsMissing.length})</span>
        </div>
        {keywordsMissing.length === 0 ? (
          <p className="text-sm text-muted-foreground">No missing ATS keywords.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {keywordsMissing.map((kw, i) => (
              <motion.span
                key={kw + i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300"
              >
                <XCircle className="h-3 w-3" />
                {kw}
              </motion.span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}