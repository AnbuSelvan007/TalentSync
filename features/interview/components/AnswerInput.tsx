"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function AnswerInput({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder = "Type your answer here...",
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border bg-card/50 p-6 shadow-sm backdrop-blur dark:border-zinc-800"
    >
      <label className="mb-3 block text-sm font-medium text-muted-foreground">
        Your Answer
      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        rows={6}
        className="w-full resize-none rounded-2xl border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary disabled:opacity-50 dark:border-zinc-700"
      />

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {value.length} characters
        </span>

        <motion.button
          whileHover={value.trim() ? { scale: 1.02 } : {}}
          whileTap={value.trim() ? { scale: 0.98 } : {}}
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          Submit Answer
        </motion.button>
      </div>
    </motion.div>
  );
}