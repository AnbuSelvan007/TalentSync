"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const loadingSteps = [
  "Extracting text from PDF...",
  "Analyzing resume content...",
  "Calculating ATS score...",
  "Generating insights...",
];

export default function AnalysisLoader() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-3xl border bg-gradient-to-br from-primary/5 to-primary/10 p-12 dark:border-primary/20"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Sparkles className="h-6 w-6 text-primary" />
          </motion.div>
        </div>

        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-semibold"
          >
            Analyzing Your Resume
          </motion.h2>

          <div className="mt-4 space-y-2">
            {loadingSteps.map((step, i) => (
              <motion.p
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.8 }}
                className="flex items-center  gap-2 text-sm text-muted-foreground"
              >
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.8 }}
                  className="h-1.5 w-1.5 rounded-full bg-primary"
                />
                {step}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}