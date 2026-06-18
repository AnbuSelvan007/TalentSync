"use client";

import { useState, useRef, useEffect } from "react";
import type { ResumeAnalysis } from "@/features/resume/types/resume.types";
import ResumeHero from "@/features/resume/components/ResumeHero";
import ResumeUpload from "@/features/resume/components/ResumeUpload";
import AnalysisLoader from "@/features/resume/components/AnalysisLoader";
import EmptyResumeState from "@/features/resume/components/EmptyResumeState";
import ResumeResults from "@/features/resume/components/ResumeResults";
import ErrorCard from "@/features/resume/components/ErrorCard";
import PastResultBanner, { downloadAsPdf } from "@/components/shared/PastResultBanner";

interface StoredResult extends ResumeAnalysis {
  fileName?: string;
  createdAt?: string;
}

export default function ResumeReviewPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLatest, setIsLoadingLatest] = useState(true);
  const [error, setError] = useState<{ message: string; detail?: string } | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [storedResult, setStoredResult] = useState<StoredResult | null>(null);
  const lastFileRef = useRef<File | null>(null);

  // Load latest stored result on mount
  useEffect(() => {
    fetch("/api/resume/analyze")
      .then((res) => res.json())
      .then((data) => {
        if (data.result && !isAnalysisEmpty(data.result as ResumeAnalysis)) {
          setStoredResult(data.result as StoredResult);
        }
      })
      .catch((err) => console.error("Failed to load latest resume analysis:", err))
      .finally(() => setIsLoadingLatest(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isAnalysisEmpty = (a: ResumeAnalysis) =>
    a.score === 0 &&
    a.strengths.length === 0 &&
    a.weaknesses.length === 0 &&
    a.suggestions.length === 0 &&
    a.missingKeywords.length === 0;

  const handleDownload = () => {
    if (!storedResult) return;
    const items = [
      `<h1>Resume Analysis Report</h1>`,
      storedResult.fileName ? `<p><strong>File:</strong> ${storedResult.fileName}</p>` : "",
      storedResult.createdAt ? `<p><strong>Date:</strong> ${new Date(storedResult.createdAt).toLocaleDateString()}</p>` : "",
      `<div class="section"><h2>ATS Score</h2><div class="score ${storedResult.score >= 70 ? 'score-high' : storedResult.score >= 40 ? 'score-medium' : 'score-low'}">${storedResult.score}/100</div></div>`,
      `<div class="section"><h2>Strengths</h2><ul>${storedResult.strengths.map((s) => `<li>${s}</li>`).join("")}</ul></div>`,
      `<div class="section"><h2>Weaknesses</h2><ul>${storedResult.weaknesses.map((w) => `<li>${w}</li>`).join("")}</ul></div>`,
      `<div class="section"><h2>Suggestions</h2><ul>${storedResult.suggestions.map((s) => `<li>${s}</li>`).join("")}</ul></div>`,
      `<div class="section"><h2>Missing Keywords</h2><ul>${storedResult.missingKeywords.map((k) => `<li>${k}</li>`).join("")}</ul></div>`,
    ].join("\n");
    downloadAsPdf(`Resume_Analysis_${storedResult.fileName || "report"}`, items);
  };

  const handleDismiss = () => {
    setStoredResult(null);
  };

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setStoredResult(null);
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

      const result: ResumeAnalysis = data;

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

      {storedResult && !analysis && !isLoading && (
        <PastResultBanner
          title={`Resume Analysis — ${storedResult.fileName || "resume.pdf"}`}
          subtitle={`Score: ${storedResult.score}/100 • ${storedResult.strengths.length} strengths, ${storedResult.suggestions.length} suggestions`}
          onDownload={handleDownload}
        >
          <div className="flex gap-2">
            <button
              onClick={() => handleFileSelect(new File([], storedResult.fileName || "resume.pdf"))}
              className="text-xs text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Upload new resume to re-analyze
            </button>
            <span className="text-xs text-muted-foreground">·</span>
            <button
              onClick={handleDismiss}
              className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Dismiss
            </button>
          </div>
        </PastResultBanner>
      )}

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

      {!analysis && !storedResult && !isLoadingLatest && !isLoading && !error && <EmptyResumeState />}
    </div>
  );
}