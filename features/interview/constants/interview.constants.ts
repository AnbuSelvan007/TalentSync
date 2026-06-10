import type { Role, ExperienceLevel, Difficulty } from "@/features/interview/types/interview.types";

export const ROLES: Role[] = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "AI Engineer",
];

export const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  "Fresher",
  "1 Year",
  "2 Years",
  "3+ Years",
];

export const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

export const QUESTION_COUNTS = [5, 10, 15];

export const DEMO_QUESTIONS = [
  "Explain the concept of closures in JavaScript and provide a real-world example.",
  "What is the difference between let, const, and var in JavaScript?",
  "Explain how the virtual DOM works in React.",
  "Describe the CSS Box Model and how it affects layout.",
  "What are React hooks and how do they work?",
  "Explain the concept of event delegation in JavaScript.",
  "What is the difference between TCP and UDP?",
  "Explain RESTful API design principles.",
  "What is a Promise in JavaScript and how does it differ from callbacks?",
  "Describe the concept of responsive design in CSS.",
];