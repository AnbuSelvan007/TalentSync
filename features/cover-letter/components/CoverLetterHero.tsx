"use client";

import { motion } from "framer-motion";
import { FileSignature, Sparkles } from "lucide-react";

export default function CoverLetterHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-primary/10 p-3">
          <FileSignature className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            AI Cover Letter Generator
          </h1>
          <p className="text-base text-muted-foreground">
            Generate personalized cover letters tailored to specific jobs.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {["ATS Friendly", "Personalized", "Professional Tone"].map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
          >
            <Sparkles className="h-3 w-3" />
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}