"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertOctagon, RefreshCw } from "lucide-react";
import InterviewHero from "@/features/interview/components/InterviewHero";
import InterviewSetupCard from "@/features/interview/components/InterviewSetupCard";
import InterviewProgress from "@/features/interview/components/InterviewProgress";
import QuestionCard from "@/features/interview/components/QuestionCard";
import AnswerInput from "@/features/interview/components/AnswerInput";
import EvaluationCard from "@/features/interview/components/EvaluationCard";
import InterviewSummary from "@/features/interview/components/InterviewSummary";
import { useInterviewDemo } from "@/features/interview/hooks/useInterviewDemo";
import PastResultBanner, { downloadAsPdf } from "@/components/shared/PastResultBanner";

function LoadingCard({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border bg-gradient-to-br from-primary/5 to-primary/10 p-12 shadow-sm dark:border-primary/20"
    >
      <div className="flex flex-col items-center gap-5">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <div className="text-center">
          <p className="text-lg font-semibold">{text}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This may take a moment...
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 rounded-3xl border border-red-200 bg-gradient-to-br from-red-500/5 to-red-600/5 p-6 shadow-sm dark:border-red-900/30"
    >
      <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
        <AlertOctagon className="h-5 w-5 text-red-600 dark:text-red-400" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-red-800 dark:text-red-300">
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      )}
    </motion.div>
  );
}

export default function MockInterviewPage() {
  const {
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
  } = useInterviewDemo();

  const [storedResult, setStoredResult] = useState<{
    role: string;
    difficulty: string;
    questionsCount: number;
    finalScore: number;
    createdAt?: string;
  } | null>(null);
  const [isLoadingLatest, setIsLoadingLatest] = useState(true);

  useEffect(() => {
    fetch("/api/interview")
      .then((res) => res.json())
      .then((data) => {
        if (data.result?.questions?.length > 0 && data.result?.finalScore !== undefined) {
          setStoredResult({
            role: data.result.role,
            difficulty: data.result.difficulty,
            questionsCount: data.result.questions.length,
            finalScore: data.result.finalScore,
            createdAt: data.result.createdAt,
          });
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingLatest(false));
  }, []);

  const handleDownload = () => {
    if (!storedResult) return;
    const items = [
      `<h1>Mock Interview Summary</h1>`,
      `<p><strong>Role:</strong> ${storedResult.role}</p>`,
      `<p><strong>Difficulty:</strong> ${storedResult.difficulty}</p>`,
      `<p><strong>Questions:</strong> ${storedResult.questionsCount}</p>`,
      storedResult.createdAt ? `<p><strong>Date:</strong> ${new Date(storedResult.createdAt).toLocaleDateString()}</p>` : "",
      `<div class="section"><h2>Final Score</h2><div class="score ${storedResult.finalScore >= 7 ? 'score-high' : storedResult.finalScore >= 4 ? 'score-medium' : 'score-low'}">${storedResult.finalScore}/10</div></div>`,
    ].join("\n");
    downloadAsPdf(`Mock_Interview_${storedResult.role}`, items);
  };

  const handleRetry = () => {
    if (phase === "setup" || questions.length === 0) {
      startInterview();
    } else if (!showEvaluation) {
      submitAnswer();
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <InterviewHero />

      {storedResult && phase === "setup" && !isLoadingLatest && (
        <PastResultBanner
          title={`Mock Interview — ${storedResult.role}`}
          subtitle={`Score: ${storedResult.finalScore}/10 • ${storedResult.questionsCount} questions • ${storedResult.difficulty}`}
          onDownload={handleDownload}
        >
          <button
            onClick={() => {
              setStoredResult(null);
              restart();
            }}
            className="text-xs text-primary underline underline-offset-2 hover:text-primary/80"
          >
            Start a new interview
          </button>
        </PastResultBanner>
      )}

      {phase === "setup" && (
        <>
          {isLoading && <LoadingCard text="Generating your interview..." />}
          {error && <ErrorBanner message={error} onRetry={handleRetry} />}
          {!isLoading && (
            <InterviewSetupCard
              role={setup.role}
              experience={setup.experience}
              difficulty={setup.difficulty}
              questionCount={setup.questionCount}
              onRoleChange={(v) => setSetup((prev) => ({ ...prev, role: v }))}
              onExperienceChange={(v) => setSetup((prev) => ({ ...prev, experience: v }))}
              onDifficultyChange={(v) => setSetup((prev) => ({ ...prev, difficulty: v }))}
              onQuestionCountChange={(v) => setSetup((prev) => ({ ...prev, questionCount: v }))}
              onStart={startInterview}
            />
          )}
        </>
      )}

      {phase === "in-progress" && currentQuestion && (
        <>
          {error && <ErrorBanner message={error} onRetry={handleRetry} />}

          <motion.div
            key={`progress-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <InterviewProgress current={currentIndex} total={questions.length} />
          </motion.div>

          <QuestionCard
            key={`q-${currentIndex}`}
            question={currentQuestion.question}
            questionNumber={currentIndex + 1}
          />

          {!showEvaluation && !isLoading && (
            <AnswerInput
              value={answer}
              onChange={setAnswer}
              onSubmit={submitAnswer}
            />
          )}

          {isLoading && !showEvaluation && (
            <LoadingCard text="Evaluating your answer..." />
          )}

          {showEvaluation && currentQuestion.evaluation && (
            <>
              <EvaluationCard evaluation={currentQuestion.evaluation} />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={nextQuestion}
                  className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90"
                >
                  {isLastQuestion ? "View Summary" : "Next Question"}
                </motion.button>
              </motion.div>
            </>
          )}
        </>
      )}

      {phase === "summary" && (
        <InterviewSummary
          questions={questions}
          onRestart={restart}
        />
      )}
    </div>
  );
}