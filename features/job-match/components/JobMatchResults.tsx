"use client";

import { motion } from "framer-motion";
import type { JobMatchResult } from "@/features/job-match/types/job-match.types";
import MatchScoreCard from "./MatchScoreCard";
import MatchingSkillsCard from "./MatchingSkillsCard";
import MissingSkillsCard from "./MissingSkillsCard";
import KeywordAnalysisCard from "./KeywordAnalysisCard";
import ImprovementSuggestionsCard from "./ImprovementSuggestionsCard";

interface Props {
  result: JobMatchResult;
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

export default function JobMatchResults({ result }: Props) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item}>
        <MatchScoreCard score={result.matchScore} />
      </motion.div>

      <motion.div
        variants={item}
        className="grid gap-6 lg:grid-cols-2"
      >
        <MatchingSkillsCard skills={result.matchingSkills} />
        <MissingSkillsCard skills={result.missingSkills} />
      </motion.div>

      <motion.div variants={item}>
        <KeywordAnalysisCard
          keywordsFound={result.keywordsFound}
          keywordsMissing={result.keywordsMissing}
        />
      </motion.div>

      <motion.div variants={item}>
        <ImprovementSuggestionsCard suggestions={result.suggestions} />
      </motion.div>
    </motion.div>
  );
}