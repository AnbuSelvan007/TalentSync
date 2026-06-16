"use client";

import { useState, useRef } from "react";
import type { JobMatchResult, JobMatchPhase } from "@/features/job-match/types/job-match.types";

export function useJobMatch() {
  const [phase, setPhase] = useState<JobMatchPhase>("input");
  const [result, setResult] = useState<JobMatchResult | null>(null);
  const [error, setError] = useState<{ message: string; detail?: string } | null>(null);
  const [isLoadingLatest, setIsLoadingLatest] = useState(false);
  const lastFileRef = useRef<File | null>(null);
  const lastJdRef = useRef<string>("");

  const loadLatestLatest = async () => {
    setIsLoadingLatest(true);
    try {
      const res = await fetch("/api/job-match/analyze");
      const data = await res.json();
      if (data.result) {
        setResult(data.result as unknown as JobMatchResult);
        setPhase("result");
      }
    } catch (err) {
      console.error("Failed to load latest job match:", err);
    } finally {
      setIsLoadingLatest(false);
    }
  };

  const isAnalysisEmpty = (r: JobMatchResult) =>
    r.matchScore === 0 &&
    r.matchingSkills.length === 0 &&
    r.missingSkills.length === 0 &&
    r.keywordsFound.length === 0 &&
    r.keywordsMissing.length === 0 &&
    r.suggestions.length === 0;

  const analyze = async (file: File, jobDescription: string) => {
    setPhase("analyzing");
    setError(null);
    setResult(null);
    lastFileRef.current = file;
    lastJdRef.current = jobDescription;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobDescription", jobDescription);

      const response = await fetch("/api/job-match/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze job match");
      }

      const matchResult: JobMatchResult = data;

      if (isAnalysisEmpty(matchResult)) {
        setError({
          message: "The AI was unable to analyze your resume against the job description.",
          detail: "Try uploading a detailed resume with substantial text content.",
        });
        setPhase("error");
      } else {
        setResult(matchResult);
        setPhase("result");
      }
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        detail: err instanceof Error && "detail" in err ? (err as any).detail : undefined,
      });
      setPhase("error");
    }
  };

  const retry = () => {
    if (lastFileRef.current && lastJdRef.current) {
      analyze(lastFileRef.current, lastJdRef.current);
    }
  };

  const reset = () => {
    setPhase("input");
    setResult(null);
    setError(null);
    lastFileRef.current = null;
    lastJdRef.current = "";
  };

  return {
    phase,
    result,
    error,
    isLoadingLatest,
    analyze,
    retry,
    reset,
    loadLatestLatest,
  };
}