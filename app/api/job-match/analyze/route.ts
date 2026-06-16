import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { pathToFileURL } from "url";
import { getCurrentUserId, unauthorized } from "@/lib/auth/session";
import { jobMatchInputSchema } from "@/features/job-match/schemas/job-match.schema";
import { analyzeJobMatch } from "@/features/job-match/services/job-match.service";
import { saveJobMatch, getLatestJobMatch } from "@/services/job-match.service";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();

    const latest = await getLatestJobMatch(userId);
    return NextResponse.json({ result: latest });
  } catch (error) {
    console.error("GET /api/job-match/analyze error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();

    const contentType = request.headers.get("content-type") || "";

    let resumeText: string;
    let jobDescription: string;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const jd = formData.get("jobDescription") as string | null;

      if (!file) {
        return NextResponse.json(
          { error: "No resume file provided" },
          { status: 400 }
        );
      }

      if (!jd || !jd.trim()) {
        return NextResponse.json(
          { error: "No job description provided" },
          { status: 400 }
        );
      }

      jobDescription = jd.trim();

      // Extract text from PDF
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
      const body = await request.json();
      resumeText = body.resumeText;
      jobDescription = body.jobDescription;
    }

    if (!resumeText || !resumeText.trim()) {
      return NextResponse.json(
        { error: "No text could be extracted from the resume." },
        { status: 422 }
      );
    }

    if (!jobDescription || !jobDescription.trim()) {
      return NextResponse.json(
        { error: "Job description is required." },
        { status: 400 }
      );
    }

    // Validate input
    const validation = jobMatchInputSchema.safeParse({
      resumeText: resumeText.trim(),
      jobDescription: jobDescription.trim(),
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", detail: validation.error.issues },
        { status: 400 }
      );
    }

    // Analyze the job match
    const result = await analyzeJobMatch(resumeText, jobDescription);

    // Save to DB (replaces old)
    await saveJobMatch(userId, {
      company: "Company",
      role: "Position",
      matchScore: result.matchScore ?? 0,
      matchingSkills: result.matchingSkills ?? [],
      missingSkills: result.missingSkills ?? [],
      suggestions: result.suggestions ?? [],
      keywordsFound: result.keywordsFound ?? [],
      keywordsMissing: result.keywordsMissing ?? [],
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Job match analysis API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}