import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, unauthorized } from "@/lib/auth/session";
import {
  generateQuestions,
  evaluateAnswer,
} from "@/features/interview/services/interview.service";
import { getLatestInterview, saveInterview } from "@/services/interview.service";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();

    const latest = await getLatestInterview(userId);
    return NextResponse.json({ result: latest });
  } catch (error) {
    console.error("GET /api/interview error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();

    const body = await request.json();
    const { action, ...data } = body;

    if (action === "generate-questions") {
      const { role, experience, difficulty, count } = data;

      if (!role || !experience || !difficulty || !count) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      const questions = await generateQuestions(role, experience, difficulty, count);

      if (questions.length === 0) {
        return NextResponse.json(
          { error: "Failed to generate questions. Please try again." },
          { status: 500 }
        );
      }

      return NextResponse.json({ questions });
    }

    if (action === "evaluate-answer") {
      const { role, experience, question, answer } = data;

      if (!role || !experience || !question || !answer) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      const evaluation = await evaluateAnswer(role, experience, question, answer);

      return NextResponse.json({ evaluation });
    }

    if (action === "save-summary") {
      const { role, difficulty, questions, answers, evaluations, finalScore } = data;

      if (!role || !questions || !evaluations) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      await saveInterview(userId, {
        role,
        difficulty: difficulty || "medium",
        questions,
        answers: answers || [],
        evaluations: evaluations || [],
        finalScore: finalScore || 0,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Interview API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}