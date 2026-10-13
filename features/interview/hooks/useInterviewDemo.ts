"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  InterviewSetup,
  InterviewQuestion,
  QuestionEvaluation,
  InterviewPhase,
  Role,
  ExperienceLevel,
  Difficulty,
} from "@/features/interview/types/interview.types";

export function useInterviewDemo() {
  const [phase, setPhase] = useState<InterviewPhase>("setup");
  const [setup, setSetup] = useState<InterviewSetup>({
    role: "Frontend Developer" as Role,
    experience: "Fresher" as ExperienceLevel,
    difficulty: "Medium" as Difficulty,
    questionCount: 5,
  });
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const currentQuestion = questions[currentIndex] ?? null;
  const isLastQuestion = currentIndex >= questions.length - 1;

  const startInterview = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate-questions",
          role: setup.role,
          experience: setup.experience,
          difficulty: setup.difficulty,
          count: setup.questionCount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate questions");
      }

      const generated: string[] = data.questions;

      if (!generated || generated.length === 0) {
        throw new Error("No questions were generated. Please try again.");
      }

      const newQuestions: InterviewQuestion[] = generated.map((q, i) => ({
        id: `q-${i + 1}`,
        question: q,
        answer: "",
        evaluation: null,
      }));

      setQuestions(newQuestions);
      setCurrentIndex(0);
      setAnswer("");
      setShowEvaluation(false);
      setPhase("in-progress");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [setup]);

  const submitAnswer = useCallback(async () => {
    if (!currentQuestion || !answer.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate-answer",
          role: setup.role,
          experience: setup.experience,
          question: currentQuestion.question,
          answer: answer.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to evaluate answer");
      }

      const evaluation: QuestionEvaluation = data.evaluation;

      setQuestions((prev) =>
        prev.map((q, i) =>
          i === currentIndex
            ? { ...q, answer: answer.trim(), evaluation }
            : q
        )
      );
      setShowEvaluation(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to evaluate answer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [currentQuestion, currentIndex, answer, setup]);

  // Save summary to DB when reaching summary phase
  useEffect(() => {
    if (phase === "summary" && questions.length > 0 && !isSaving) {
      setIsSaving(true);
      const avgScore = questions.reduce((sum, q) => sum + (q.evaluation?.score ?? 0), 0) / questions.length;

      fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save-summary",
          role: setup.role,
          difficulty: setup.difficulty,
          questions: questions.map((q) => q.question),
          answers: questions.map((q) => q.answer),
          evaluations: questions.map((q) => q.evaluation),
          finalScore: Math.round(avgScore),
        }),
      }).catch((err) => console.error("Failed to save interview summary:", err));
    }
  }, [phase, questions, setup, isSaving]);

  const nextQuestion = useCallback(() => {
    if (isLastQuestion) {
      setPhase("summary");
    } else {
      setCurrentIndex((prev) => prev + 1);
      setAnswer("");
      setShowEvaluation(false);
      setError(null);
    }
  }, [isLastQuestion]);

  const restart = useCallback(() => {
    setPhase("setup");
    setQuestions([]);
    setCurrentIndex(0);
    setAnswer("");
    setShowEvaluation(false);
    setIsLoading(false);
    setError(null);
    setIsSaving(false);
  }, []);

  return {
    phase,
    setup,
    setSetup,
    questions,
    currentIndex,
    currentQuestion,
    answer,
    setAnswer,
    showEvaluation,
    isLastQuestion,
    isLoading,
    error,
    startInterview,
    submitAnswer,
    nextQuestion,
    restart,
  };
}