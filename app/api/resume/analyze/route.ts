import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { pathToFileURL } from "url";
import { getCurrentUserId, unauthorized } from "@/lib/auth/session";
import { saveResumeAnalysis, getLatestResumeAnalysis } from "@/services/resume.service";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();

    const latest = await getLatestResumeAnalysis(userId);
    return NextResponse.json({ result: latest });
  } catch (error) {
    console.error("GET /api/resume/analyze error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();

    let resumeText: string;
    let fileName = "resume.txt";

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      // Handle file upload
      const formData = await request.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No resume file provided" }, { status: 400 });
      }

      fileName = file.name;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      try {
        const { PDFParse } = await import("pdf-parse");
        const workerPath = path.resolve(
          "node_modules/pdf-parse/node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"
        );
        PDFParse.setWorker(pathToFileURL(workerPath).href);
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        resumeText = result.text;
      } catch (parseError) {
        console.error("PDF parse error:", parseError);
        return NextResponse.json(
          {
            error: "Failed to parse PDF. Ensure the file is a valid PDF.",
            detail: parseError instanceof Error ? parseError.message : String(parseError),
          },
          { status: 422 }
        );
      }
    } else {
      // Handle JSON request
      const body = await request.json();
      resumeText = body.resumeText;
      fileName = body.fileName || "resume.txt";
    }

    if (!resumeText || !resumeText.trim()) {
      return NextResponse.json(
        { error: "No text could be extracted from the resume.", detail: "The PDF appears to be empty or unreadable." },
        { status: 422 }
      );
    }

    const { analyzeResume } = await import("@/features/resume/actions/analyze-resume");
    const result = await analyzeResume(resumeText);

    // Save to DB (replaces old)
    await saveResumeAnalysis(userId, {
      fileName,
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