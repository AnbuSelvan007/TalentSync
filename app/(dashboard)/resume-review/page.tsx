"use client";

import { useState, useRef } from "react";
import type { ResumeAnalysis } from "@/features/resume/types/resume.types";
import ResumeHero from "@/features/resume/components/ResumeHero";
import ResumeUpload from "@/features/resume/components/ResumeUpload";
import AnalysisLoader from "@/features/resume/components/AnalysisLoader";
import EmptyResumeState from "@/features/resume/components/EmptyResumeState";
import ResumeResults from "@/features/resume/components/ResumeResults";
import ErrorCard from "@/features/resume/components/ErrorCard";

export default function ResumeReviewPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; detail?: string } | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const lastFileRef = useRef<File | null>(null);

  const isAnalysisEmpty = (a: ResumeAnalysis) =>
    a.score === 0 &&
    a.strengths.length === 0 &&
    a.weaknesses.length === 0 &&
    a.suggestions.length === 0 &&
    a.missingKeywords.length === 0;

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    lastFileRef.current = file;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze resume");
      }

      const result: ResumeAnalysis = data.analysis;

      // If Gemini returned empty data, treat as an error
      if (isAnalysisEmpty(result)) {
        setError({
          message: "The AI was unable to analyze your resume. This may happen with test PDFs or non-standard formats.",
          detail: "Try uploading a detailed resume with substantial text content.",
        });
      } else {
        setAnalysis(result);
      }
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        detail: err instanceof Error && "detail" in err ? (err as any).detail : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastFileRef.current) {
      handleFileSelect(lastFileRef.current);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-10">
      <ResumeHero />

      <ResumeUpload onFileSelect={handleFileSelect} />

      {isLoading && <AnalysisLoader />}

      {error && !isLoading && (
        <ErrorCard
          error={error.message}
          detail={error.detail}
          onRetry={lastFileRef.current ? handleRetry : undefined}
        />
      )}

      {analysis && !isLoading && !error && <ResumeResults analysis={analysis} />}

      {!analysis && !isLoading && !error && <EmptyResumeState />}
    </div>
  );
}