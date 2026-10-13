import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { pathToFileURL } from "url";
import { getCurrentUserId, unauthorized } from "@/lib/auth/session";
import { saveResumeAnalysis } from "@/services/resume.service";
import { analyzeResume } from "@/features/resume/actions/analyze-resume";

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();

    const contentType = request.headers.get("content-type") || "";

    let resumeText = "";
    let fileName = "resume.pdf";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { error: "No file provided" },
          { status: 400 }
        );
      }

      if (
        file.type &&
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
      ) {
        return NextResponse.json(
          { error: "Only PDF files are accepted" },
          { status: 400 }
        );
      }

      if (file.size === 0) {
        return NextResponse.json(
          { error: "The uploaded file is empty" },
          { status: 400 }
        );
      }

      fileName = file.name || "resume.pdf";

      // Extract text from PDF
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      try {
        const { PDFParse } = await import("pdf-parse");

        // Point worker to the one bundled inside pdf-parse's own pdfjs-dist
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
      const body = await request.json();
      resumeText = body.resumeText || "";
      fileName = body.fileName || "resume.txt";
    }

    if (!resumeText || !resumeText.trim()) {
      return NextResponse.json(
        { error: "No text could be extracted from the PDF." },
        { status: 422 }
      );
    }

    const result = await analyzeResume(resumeText);

    // Save to history
    if (userId) {
      try {
        await saveResumeAnalysis(userId, {
          fileName: fileName || "resume.pdf",
          score: result.score ?? 0,
          strengths: result.strengths ?? [],
          weaknesses: result.weaknesses ?? [],
          suggestions: result.suggestions ?? [],
          missingKeywords: result.missingKeywords ?? [],
          atsScore: result.score ?? 0,
        });
      } catch (dbError) {
        console.error("Failed to save resume analysis to history:", dbError);
      }
    }

    return NextResponse.json({
      analysis: result,
      ...result,
    });
  } catch (error) {
    console.error("Resume API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        detail: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    );
  }
}