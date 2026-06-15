"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function JobDescriptionInput({ value, onChange, disabled }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-3xl border bg-card/50 p-6 shadow-lg backdrop-blur transition-all hover:shadow-xl dark:border-zinc-800"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-xl bg-primary/10 p-2">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Job Description</h3>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Paste the job description here..."
        rows={8}
        className="w-full resize-none rounded-xl border bg-background p-4 text-sm outline-none transition-colors focus:border-primary disabled:opacity-50 dark:border-zinc-700"
      />
    </motion.div>
  );
}