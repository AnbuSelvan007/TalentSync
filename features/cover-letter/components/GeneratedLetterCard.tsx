"use client";

import { motion } from "framer-motion";
import { FileSignature, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import CopyButton from "./CopyButton";
import DownloadButton from "./DownloadButton";

interface Props {
  content: string;
  onRegenerate: () => void;
  disabled?: boolean;
}

export default function GeneratedLetterCard({ content, onRegenerate, disabled }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileSignature className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Your Cover Letter</h2>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={content} />
          <DownloadButton text={content} />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRegenerate}
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </motion.button>
        </div>
      </div>

      <div className="rounded-3xl border bg-card/50 p-8 shadow-lg backdrop-blur dark:border-zinc-800">
        <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}