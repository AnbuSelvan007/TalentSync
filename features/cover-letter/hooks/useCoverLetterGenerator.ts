"use client";

import { useState, useRef } from "react";
import type { ApplicantInfo, CoverLetterPhase } from "@/features/cover-letter/types/cover-letter.types";

export function useCoverLetterGenerator() {
  const [phase, setPhase] = useState<CoverLetterPhase>("form");
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; detail?: string } | null>(null);
  const [isLoadingLatest, setIsLoadingLatest] = useState(false);
  const lastApplicantRef = useRef<ApplicantInfo | null>(null);
  const lastFileRef = useRef<File | null>(null);
  const lastJdRef = useRef<string>("");

  const loadLatestFromDb = async () => {
    setIsLoadingLatest(true);
    try {
      const res = await fetch("/api/cover-letter/generate");
      const data = await res.json();
      if (data.result?.content) {
        // Don't set coverLetter or phase — let the page handle banner display
        // via its own storedLetter state
      }
    } catch (err) {
      console.error("Failed to load latest cover letter:", err);
    } finally {
      setIsLoadingLatest(false);
    }
  };

  const generate = async (applicant: ApplicantInfo, file: File, jobDescription: string) => {
    setPhase("generating");
    setError(null);
    setCoverLetter(null);
    lastApplicantRef.current = applicant;
    lastFileRef.current = file;
    lastJdRef.current = jobDescription;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobDescription", jobDescription);
      formData.append("fullName", applicant.fullName);
      formData.append("role", applicant.role);
      formData.append("company", applicant.company);
      formData.append("experience", applicant.experience);

      const response = await fetch("/api/cover-letter/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate cover letter");
      }

      if (!data.coverLetter || !data.coverLetter.trim()) {
        setError({
          message: "The AI was unable to generate a cover letter.",
          detail: "Try uploading a detailed resume with substantial text content.",
        });
        setPhase("error");
      } else {
        setCoverLetter(data.coverLetter);
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

  const regenerate = () => {
    if (lastApplicantRef.current && lastFileRef.current && lastJdRef.current) {
      generate(lastApplicantRef.current, lastFileRef.current, lastJdRef.current);
    }
  };

  const reset = () => {
    setPhase("form");
    setCoverLetter(null);
    setError(null);
    lastApplicantRef.current = null;
    lastFileRef.current = null;
    lastJdRef.current = "";
  };

  return {
    phase,
    coverLetter,
    error,
    isLoadingLatest,
    generate,
    regenerate,
    reset,
    loadLatestFromDb,
  };
}