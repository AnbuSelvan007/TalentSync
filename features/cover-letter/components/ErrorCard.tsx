"use client";

import { motion } from "framer-motion";
import { AlertOctagon, RefreshCw, HelpCircle } from "lucide-react";

interface Props {
  error: string;
  onRetry?: () => void;
  detail?: string;
}

export default function ErrorCard({ error, onRetry, detail }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-red-200 bg-gradient-to-br from-red-500/5 to-red-600/5 p-8 shadow-sm dark:border-red-900/30"
    >
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
          <AlertOctagon className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">Generation Failed</h3>
          <p className="text-sm text-red-600/90 dark:text-red-400/90">{error}</p>
          {detail && <p className="text-xs text-red-500/70 dark:text-red-500/70">{detail}</p>}
        </div>
        <div className="flex items-center gap-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-full bg-red-100 px-5 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          )}
          <div className="flex items-center gap-1.5 text-xs text-red-500/70">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Check your inputs and try again</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}