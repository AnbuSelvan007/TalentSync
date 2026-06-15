import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, unauthorized } from "@/lib/auth/session";
import { saveResumeAnalysis } from "@/services/resume.service";

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();

    const body = await request.json();
    const { resumeText, fileName } = body;

    if (!resumeText) {
      return NextResponse.json({ error: "resumeText is required" }, { status: 400 });
    }

    const { analyzeResume } = await import("@/features/resume/actions/analyze-resume");
    const result = await analyzeResume(resumeText);

    // Save to history
    await saveResumeAnalysis(userId, {
      fileName: fileName || "resume.txt",
      score: result.score ?? 0,
      strengths: result.strengths ?? [],
      weaknesses: result.weaknesses ?? [],
      suggestions: result.suggestions ?? [],
      missingKeywords: result.missingKeywords ?? [],
      atsScore: result.score ?? 0,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Resume API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}