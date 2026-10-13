"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wand2,
  AlertCircle,
  CheckCircle2,
  FileText,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import JobMatchHero from "@/features/job-match/components/JobMatchHero";
import ResumeUploadCard from "@/features/job-match/components/ResumeUploadCard";
import JobDescriptionInput from "@/features/job-match/components/JobDescriptionInput";
import AnalysisLoader from "@/features/job-match/components/AnalysisLoader";
import JobMatchResults from "@/features/job-match/components/JobMatchResults";
import ErrorCard from "@/features/job-match/components/ErrorCard";
import { useJobMatch } from "@/features/job-match/hooks/useJobMatch";
import { Button } from "@/components/ui/button";

export default function JobMatchPage() {
  const { phase, result, error, analyze, retry, reset } = useJobMatch();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const isAnalyzing = phase === "analyzing";
  const hasFile = !!resumeFile;
  const isJdValid = jobDescription.trim().length >= 10;
  const isReady = hasFile && isJdValid;

  const handleFileSelect = (file: File) => {
    setResumeFile(file);
    setValidationError(null);
  };

  const handleFileRemove = () => {
    setResumeFile(null);
    setValidationError(null);
  };

  const handleJobDescriptionChange = (value: string) => {
    setJobDescription(value);
    setValidationError(null);
  };

  const handleAnalyze = () => {
    if (!resumeFile) {
      setValidationError("Please upload your resume in PDF format to continue.");
      return;
    }

    if (!jobDescription.trim()) {
      setValidationError("Please paste the job description you want to compare against.");
      return;
    }

    if (jobDescription.trim().length < 10) {
      setValidationError("Job description is too short. Please provide at least 10 characters.");
      return;
    }

    setValidationError(null);
    analyze(resumeFile, jobDescription.trim());
  };

  const handleEditInputs = () => {
    reset();
    setValidationError(null);
  };

  const handleNewAnalysis = () => {
    reset();
    setResumeFile(null);
    setJobDescription("");
    setValidationError(null);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:space-y-8 sm:py-8">
      <JobMatchHero />

      {/* Input Phase: Form & Visible Analyze Button */}
      {phase !== "result" && (
        <div className="space-y-6">
          <ResumeUploadCard
            onFileSelect={handleFileSelect}
            selectedFile={resumeFile}
            onFileRemove={handleFileRemove}
            disabled={isAnalyzing}
          />

          <JobDescriptionInput
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            disabled={isAnalyzing}
          />

          {/* Validation Checklist / Guidance */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
            <div
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-colors ${
                hasFile
                  ? "bg-emerald-500/10 font-medium text-emerald-600 dark:text-emerald-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {hasFile ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              <span>{hasFile ? resumeFile.name : "Resume PDF required"}</span>
            </div>

            <div
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-colors ${
                isJdValid
                  ? "bg-emerald-500/10 font-medium text-emerald-600 dark:text-emerald-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isJdValid ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              <span>
                {isJdValid
                  ? `${jobDescription.trim().length} characters`
                  : "Job description (min 10 chars)"}
              </span>
            </div>
          </div>

          {/* Inline Validation Error Banner */}
          <AnimatePresence>
            {validationError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mx-auto flex max-w-lg items-center gap-2.5 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{validationError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prominent Analyze Button */}
          <div className="flex flex-col items-center justify-center gap-3 pt-2">
            <motion.button
              type="button"
              id="analyze-job-match-button"
              whileHover={!isAnalyzing ? { scale: 1.02 } : {}}
              whileTap={!isAnalyzing ? { scale: 0.98 } : {}}
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className={`relative flex w-full max-w-md items-center justify-center gap-2.5 rounded-2xl px-6 py-4 text-base font-semibold shadow-lg transition-all ${
                isReady && !isAnalyzing
                  ? "bg-primary text-primary-foreground shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
                  : "bg-primary/80 text-primary-foreground/90 hover:bg-primary hover:text-primary-foreground"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {isAnalyzing ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Analyzing Match...</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  <span>Analyze Job Match</span>
                  {isReady && <Sparkles className="h-4 w-4 text-amber-300" />}
                </>
              )}
            </motion.button>
            <p className="text-xs text-muted-foreground">
              {isReady
                ? "Click above to compare your resume with the job requirements"
                : "Upload a PDF resume and paste the job description to run analysis"}
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {phase === "analyzing" && <AnalysisLoader />}

      {/* Error State */}
      {phase === "error" && error && (
        <div className="space-y-4">
          <ErrorCard
            error={error.message}
            detail={error.detail}
            onRetry={retry}
          />
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleEditInputs}
              className="gap-2 rounded-xl"
            >
              <RotateCcw className="h-4 w-4" />
              Edit Inputs & Retry
            </Button>
          </div>
        </div>
      )}

      {/* Result State */}
      {phase === "result" && result && (
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card/60 p-4 shadow-sm backdrop-blur">
            <div>
              <h2 className="text-lg font-semibold">Match Results</h2>
              <p className="text-xs text-muted-foreground">
                Resume: {resumeFile?.name || "Uploaded Resume"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditInputs}
                className="gap-1.5 rounded-xl"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Edit Inputs
              </Button>
              <Button
                size="sm"
                onClick={handleNewAnalysis}
                className="gap-1.5 rounded-xl"
              >
                <Wand2 className="h-3.5 w-3.5" />
                New Analysis
              </Button>
            </div>
          </div>

          <JobMatchResults result={result} />

          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={handleNewAnalysis}
              className="gap-2 rounded-2xl px-6 py-3 font-semibold shadow-md"
            >
              <Wand2 className="h-4 w-4" />
              Analyze Another Job Description
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}