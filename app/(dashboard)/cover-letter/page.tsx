"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";
import CoverLetterHero from "@/features/cover-letter/components/CoverLetterHero";
import ApplicantForm from "@/features/cover-letter/components/ApplicantForm";
import ResumeUploadCard from "@/features/cover-letter/components/ResumeUploadCard";
import JobDescriptionInput from "@/features/cover-letter/components/JobDescriptionInput";
import GenerationLoader from "@/features/cover-letter/components/GenerationLoader";
import GeneratedLetterCard from "@/features/cover-letter/components/GeneratedLetterCard";
import ErrorCard from "@/features/cover-letter/components/ErrorCard";
import { useCoverLetterGenerator } from "@/features/cover-letter/hooks/useCoverLetterGenerator";
import type { ApplicantInfo } from "@/features/cover-letter/types/cover-letter.types";

const defaultApplicant: ApplicantInfo = {
  fullName: "",
  role: "",
  company: "",
  experience: "",
};

export default function CoverLetterPage() {
  const { phase, coverLetter, error, generate, regenerate, reset } = useCoverLetterGenerator();
  const [applicant, setApplicant] = useState<ApplicantInfo>(defaultApplicant);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");

  const isGenerating = phase === "generating";
  const canGenerate =
    applicant.fullName.trim() &&
    applicant.role.trim() &&
    applicant.company.trim() &&
    applicant.experience.trim() &&
    resumeFile &&
    jobDescription.trim().length >= 10;

  const handleGenerate = () => {
    if (!resumeFile || !canGenerate) return;
    generate(applicant, resumeFile, jobDescription);
  };

  const handleRegenerate = () => {
    regenerate();
  };

  const handleNew = () => {
    reset();
    setApplicant(defaultApplicant);
    setResumeFile(null);
    setJobDescription("");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-10">
      <CoverLetterHero />

      {/* Form Phase */}
      {phase !== "result" && (
        <div className="space-y-6">
          <ApplicantForm
            value={applicant}
            onChange={setApplicant}
            disabled={isGenerating}
          />

          <ResumeUploadCard
            onFileSelect={setResumeFile}
          />

          <JobDescriptionInput
            value={jobDescription}
            onChange={setJobDescription}
            disabled={isGenerating}
          />

          <div className="flex justify-center">
            <motion.button
              whileHover={canGenerate ? { scale: 1.02 } : {}}
              whileTap={canGenerate ? { scale: 0.98 } : {}}
              onClick={handleGenerate}
              disabled={!canGenerate || isGenerating}
              className="flex w-full max-w-md items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  Generate Cover Letter
                </>
              )}
            </motion.button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {phase === "generating" && <GenerationLoader />}

      {/* Error State */}
      {phase === "error" && error && (
        <ErrorCard
          error={error.message}
          detail={error.detail}
          onRetry={handleRegenerate}
        />
      )}

      {/* Result Phase */}
      {phase === "result" && coverLetter && (
        <div className="space-y-6">
          <GeneratedLetterCard
            content={coverLetter}
            onRegenerate={handleRegenerate}
            disabled={isGenerating}
          />
          <div className="flex justify-center">
            <button
              onClick={handleNew}
              className="text-sm text-muted-foreground underline transition-colors hover:text-foreground"
            >
              Create a new cover letter
            </button>
          </div>
        </div>
      )}

      {/* Empty / Ready State (only shown in form phase) */}
      {phase === "form" && !resumeFile && !jobDescription && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center rounded-3xl border bg-card/30 px-8 py-16 shadow-lg backdrop-blur dark:border-zinc-800"
        >
          <div className="rounded-2xl bg-muted p-4">
            <Wand2 className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="mt-6 text-xl font-semibold">Ready to Generate</h3>
          <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
            Fill in your details, upload your resume, and paste a job description to generate a professional,
            ATS-friendly cover letter tailored to the position.
          </p>
        </motion.div>
      )}
    </div>
  );
}