"use client";

import { motion } from "framer-motion";
import { FileSearch, Upload } from "lucide-react";

export default function EmptyResumeState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-3xl border bg-gradient-to-br from-muted/50 to-background p-16 dark:border-zinc-800"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="rounded-full bg-primary/5 p-5">
          <FileSearch
            size={48}
            className="text-muted-foreground"
          />
        </div>

        <div className="max-w-sm text-center">
          <h3 className="text-xl font-semibold">
            No Analysis Yet
          </h3>

          <p className="mt-2 text-muted-foreground">
            Upload your resume in PDF format to generate ATS insights, identify
            strengths, and discover improvement opportunities.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Upload className="h-3.5 w-3.5" />
          <span>Supports PDF files only</span>
        </div>
      </div>
    </motion.div>
  );
}