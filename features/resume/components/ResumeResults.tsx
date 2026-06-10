"use client";

import { motion } from "framer-motion";
import { type ResumeAnalysis } from "@/features/resume/types/resume.types";
import ATSScoreCard from "./ATSScoreCard";
import StrengthsCard from "./StrengthsCard";
import WeaknessesCard from "./WeaknessesCard";
import SuggestionsCard from "./SuggestionsCard";
import MissingKeywordsCard from "./MissingKeywordsCard";

interface Props {
  analysis: ResumeAnalysis;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ResumeResults({ analysis }: Props) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item}>
        <ATSScoreCard score={analysis.score} />
      </motion.div>

      <motion.div
        variants={item}
        className="grid gap-6 lg:grid-cols-2"
      >
        <StrengthsCard strengths={analysis.strengths} />
        <WeaknessesCard weaknesses={analysis.weaknesses} />
      </motion.div>

      <motion.div
        variants={item}
        className="grid gap-6 lg:grid-cols-2"
      >
        <SuggestionsCard suggestions={analysis.suggestions} />
        <MissingKeywordsCard missingKeywords={analysis.missingKeywords} />
      </motion.div>
    </motion.div>
  );
}