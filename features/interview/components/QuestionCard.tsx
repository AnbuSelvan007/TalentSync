"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

interface Props {
  question: string;
  questionNumber: number;
}

export default function QuestionCard({ question, questionNumber }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      key={questionNumber}
      className="rounded-3xl border bg-gradient-to-br from-primary/5 to-primary/10 p-8 shadow-sm transition-all hover:shadow-md dark:border-primary/20"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-primary/10 p-3">
          <MessageSquare className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Question {questionNumber}
            </span>
          </div>
          <p className="text-base leading-relaxed sm:text-lg">
            {question}
          </p>
        </div>
      </div>
    </motion.div>
  );
}