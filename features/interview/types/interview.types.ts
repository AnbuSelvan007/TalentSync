export type Role =
  | "Frontend Developer"
  | "Backend Developer"
  | "Full Stack Developer"
  | "AI Engineer";

export type ExperienceLevel = "Fresher" | "1 Year" | "2 Years" | "3+ Years";

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface InterviewSetup {
  role: Role;
  experience: ExperienceLevel;
  difficulty: Difficulty;
  questionCount: number;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
  evaluation: QuestionEvaluation | null;
}

export interface QuestionEvaluation {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestedAnswer: string;
}

export type InterviewPhase = "setup" | "in-progress" | "summary";