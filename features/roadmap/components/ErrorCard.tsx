"use client";

import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  message: string;
  onRetry: () => void;
}

export default function ErrorCard({ message, onRetry }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 shadow-lg backdrop-blur dark:border-red-500/20"
    >
      <div className="flex flex-col items-center text-center">
        <div className="rounded-2xl bg-red-500/10 p-3">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-red-500">
          Failed to Generate Roadmap
        </h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          { "An unexpected error occurred. Please try again."}
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-500 transition-all hover:bg-red-500/20"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </motion.button>
      </div>
    </motion.div>
  );
}