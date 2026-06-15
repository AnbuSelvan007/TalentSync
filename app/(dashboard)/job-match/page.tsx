"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";
import JobMatchHero from "@/features/job-match/components/JobMatchHero";
import ResumeUploadCard from "@/features/job-match/components/ResumeUploadCard";
import JobDescriptionInput from "@/features/job-match/components/JobDescriptionInput";
import AnalysisLoader from "@/features/job-match/components/AnalysisLoader";
import JobMatchResults from "@/features/job-match/components/JobMatchResults";
import ErrorCard from "@/features/job-match/components/ErrorCard";
import { useJobMatch } from "@/features/job-match/hooks/useJobMatch";

export default function JobMatchPage() {
  const { phase, result, error, analyze, retry, reset } = useJobMatch();
  const [jobDescription, setJobDescription] = useState("");

  const handleFileSelect = useCallback(
    (file: File) => {
      if (!jobDescription.trim()) {
        return;
      }
      analyze(file, jobDescription);
    },
    [jobDescription, analyze]
  );

  const handleAnalyze = () => {
    // If a file was already selected, re-analyze
    if (phase === "result" || phase === "error") {
      reset();
    }
  };

  const isDisabled = phase === "analyzing";
  const showAnalyzeButton = phase === "input" && jobDescription.trim().length >= 10;

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-10">
      <JobMatchHero />

      <div className="space-y-6">
        <ResumeUploadCard onFileSelect={handleFileSelect} />

        <JobDescriptionInput
          value={jobDescription}
          onChange={setJobDescription}
          disabled={isDisabled}
        />

        {showAnalyzeButton && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center"
          >
            <p className="text-sm text-muted-foreground">
              Upload your resume and paste a job description above, then the analysis will begin automatically.
            </p>
          </motion.div>
        )}
      </div>

      {phase === "analyzing" && <AnalysisLoader />}

      {phase === "error" && error && (
        <ErrorCard
          error={error.message}
          detail={error.detail}
          onRetry={retry}
        />
      )}

      {phase === "result" && result && <JobMatchResults result={result} />}

      {phase === "input" && !result && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center rounded-3xl border bg-card/30 px-8 py-16 shadow-lg backdrop-blur dark:border-zinc-800"
        >
          <div className="rounded-2xl bg-muted p-4">
            <Wand2 className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="mt-6 text-xl font-semibold">Ready to Analyze</h3>
          <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
            Upload your resume in PDF format and paste the job description to see how well
            your skills match the requirements.
          </p>
        </motion.div>
      )}
    </div>
  );
}