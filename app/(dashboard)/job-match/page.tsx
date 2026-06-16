"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";
import JobMatchHero from "@/features/job-match/components/JobMatchHero";
import ResumeUploadCard from "@/features/job-match/components/ResumeUploadCard";
import JobDescriptionInput from "@/features/job-match/components/JobDescriptionInput";
import AnalysisLoader from "@/features/job-match/components/AnalysisLoader";
import JobMatchResults from "@/features/job-match/components/JobMatchResults";
import ErrorCard from "@/features/job-match/components/ErrorCard";
import { useJobMatch } from "@/features/job-match/hooks/useJobMatch";
import PastResultBanner, { downloadAsPdf } from "@/components/shared/PastResultBanner";

interface StoredMatch {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  keywordsFound: string[];
  keywordsMissing: string[];
  suggestions: string[];
  createdAt?: string;
}

export default function JobMatchPage() {
  const { phase, result, error, analyze, retry, reset, loadLatestLatest, isLoadingLatest } = useJobMatch();
  const [jobDescription, setJobDescription] = useState("");
  const [storedResult, setStoredResult] = useState<StoredMatch | null>(null);

  // Load latest stored result on mount
  useEffect(() => {
    loadLatestLatest();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Track stored results separately
  useEffect(() => {
    if (!result && phase === "input") {
      fetch("/api/job-match/analyze")
        .then((res) => res.json())
        .then((data) => {
          if (data.result?.matchScore !== undefined) {
            setStoredResult(data.result as StoredMatch);
          }
        })
        .catch(() => {});
    }
  }, [result, phase]);

  const handleDownload = () => {
    const data = storedResult || result;
    if (!data) return;
    const scoreClass = data.matchScore >= 70 ? 'score-high' : data.matchScore >= 40 ? 'score-medium' : 'score-low';
    const items = [
      `<h1>Job Match Analysis</h1>`,
      `<div class="section"><h2>Match Score</h2><div class="score ${scoreClass}">${data.matchScore}%</div></div>`,
      `<div class="section"><h2>Matching Skills</h2><ul>${(data.matchingSkills || []).map((s) => `<li>${s}</li>`).join("")}</ul></div>`,
      `<div class="section"><h2>Missing Skills</h2><ul>${(data.missingSkills || []).map((s) => `<li>${s}</li>`).join("")}</ul></div>`,
      `<div class="section"><h2>Keywords Found</h2><ul>${(data.keywordsFound || []).map((k) => `<li>${k}</li>`).join("")}</ul></div>`,
      `<div class="section"><h2>Keywords Missing</h2><ul>${(data.keywordsMissing || []).map((k) => `<li>${k}</li>`).join("")}</ul></div>`,
      `<div class="section"><h2>Suggestions</h2><ul>${(data.suggestions || []).map((s) => `<li>${s}</li>`).join("")}</ul></div>`,
    ].join("\n");
    downloadAsPdf("Job_Match_Analysis", items);
  };

  const handleFileSelect = useCallback(
    (file: File) => {
      if (!jobDescription.trim()) {
        return;
      }
      setStoredResult(null);
      analyze(file, jobDescription);
    },
    [jobDescription, analyze]
  );

  const handleAnalyze = () => {
    if (phase === "result" || phase === "error") {
      reset();
    }
  };

  const isDisabled = phase === "analyzing";
  const showAnalyzeButton = phase === "input" && jobDescription.trim().length >= 10;

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-10">
      <JobMatchHero />

      {storedResult && !result && !isLoadingLatest && phase === "input" && (
        <PastResultBanner
          title="Job Match Analysis"
          subtitle={`Match Score: ${storedResult.matchScore}% • ${storedResult.matchingSkills?.length || 0} matching skills, ${storedResult.suggestions?.length || 0} suggestions`}
          onDownload={handleDownload}
        >
          <div className="flex gap-2">
            <button
              onClick={() => {
                setStoredResult(null);
                reset();
              }}
              className="text-xs text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Upload new resume to re-analyze
            </button>
            <span className="text-xs text-muted-foreground">·</span>
            <button
              onClick={() => setStoredResult(null)}
              className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Dismiss
            </button>
          </div>
        </PastResultBanner>
      )}

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

      {phase === "input" && !result && !storedResult && !error && !isLoadingLatest && (
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