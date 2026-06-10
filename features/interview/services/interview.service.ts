import { ai } from "@/lib/ai/gemini";
import { INTERVIEW_QUESTION_PROMPT, INTERVIEW_EVALUATION_PROMPT } from "@/lib/ai/prompts";
import type { QuestionEvaluation } from "@/features/interview/types/interview.types";

function parseEvaluation(text: string | null | undefined): QuestionEvaluation {
  if (!text) {
    return { score: 0, strengths: [], weaknesses: [], suggestedAnswer: "" };
  }

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    const parsed = JSON.parse(jsonStr);

    return {
      score: typeof parsed.score === "number" ? Math.min(10, Math.max(0, Math.round(parsed.score))) : 0,
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
      suggestedAnswer: typeof parsed.suggestedAnswer === "string" ? parsed.suggestedAnswer : "",
    };
  } catch {
    return { score: 0, strengths: [], weaknesses: [], suggestedAnswer: "" };
  }
}

function parseQuestions(text: string | null | undefined): string[] {
  if (!text) return [];

  try {
    // Try to extract JSON array
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    const parsed = JSON.parse(jsonStr);

    if (Array.isArray(parsed)) {
      return parsed
        .map((item: any) => {
          if (typeof item === "string") return item;
          if (item && typeof item === "object" && item.question) return item.question;
          if (item && typeof item === "object" && item.text) return item.text;
          return String(item);
        })
        .filter((s: string) => s.length > 5);
    }
    return [];
  } catch {
    // Try to extract questions from lines
    const lines = text.split("\n").filter((l) => l.trim().length > 10);
    return lines.map((l) => l.replace(/^[\d\-\.\)\*]+\s*/, "").trim()).filter(Boolean);
  }
}

export async function generateQuestions(
  role: string,
  experience: string,
  difficulty: string,
  count: number
): Promise<string[]> {
  try {
    const prompt = INTERVIEW_QUESTION_PROMPT
      .replace("{COUNT}", String(count))
      .replace("{ROLE}", role)
      .replace("{EXPERIENCE}", experience)
      .replace("{DIFFICULTY}", difficulty);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const questions = parseQuestions(response.text);
    return questions.slice(0, count);
  } catch (error) {
    console.error("Failed to generate questions:", error);
    return [];
  }
}

export async function evaluateAnswer(
  role: string,
  experience: string,
  question: string,
  answer: string
): Promise<QuestionEvaluation> {
  try {
    const prompt = INTERVIEW_EVALUATION_PROMPT
      .replace("{ROLE}", role)
      .replace("{EXPERIENCE}", experience)
      .replace("{QUESTION}", question)
      .replace("{ANSWER}", answer);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return parseEvaluation(response.text);
  } catch (error) {
    console.error("Failed to evaluate answer:", error);
    return {
      score: 0,
      strengths: [],
      weaknesses: ["Failed to evaluate answer. Please try again."],
      suggestedAnswer: "",
    };
  }
}