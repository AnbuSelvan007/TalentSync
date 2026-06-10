import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/features/resume/actions/analyze-resume";
import path from "path";
import { pathToFileURL } from "url";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are accepted" },
        { status: 400 }
      );
    }

    // Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let resumeText: string;
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

    if (!resumeText.trim()) {
      return NextResponse.json(
        { error: "No text could be extracted from the PDF." },
        { status: 422 }
      );
    }

    // Analyze the resume text
    const analysis = await analyzeResume(resumeText);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Resume analysis API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}