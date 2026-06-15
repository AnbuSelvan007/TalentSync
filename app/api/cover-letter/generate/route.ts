import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { pathToFileURL } from "url";
import { coverLetterInputSchema } from "@/features/cover-letter/schemas/cover-letter.schema";
import { generateCoverLetter } from "@/features/cover-letter/services/cover-letter.service";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let applicant: { fullName: string; role: string; company: string; experience: string };
    let resumeText: string;
    let jobDescription: string;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const jd = formData.get("jobDescription") as string | null;
      const fullName = formData.get("fullName") as string | null;
      const role = formData.get("role") as string | null;
      const company = formData.get("company") as string | null;
      const experience = formData.get("experience") as string | null;

      if (!file) {
        return NextResponse.json({ error: "No resume file provided" }, { status: 400 });
      }

      if (!jd || !jd.trim()) {
        return NextResponse.json({ error: "No job description provided" }, { status: 400 });
      }

      if (!fullName || !role || !company || !experience) {
        return NextResponse.json({ error: "Missing applicant information fields" }, { status: 400 });
      }

      applicant = { fullName, role, company, experience };
      jobDescription = jd.trim();

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
      applicant = body.applicant;
      resumeText = body.resumeText;
      jobDescription = body.jobDescription;
    }

    if (!resumeText || !resumeText.trim()) {
      return NextResponse.json({ error: "No text could be extracted from the resume." }, { status: 422 });
    }

    const validation = coverLetterInputSchema.safeParse({
      applicant,
      resumeText: resumeText.trim(),
      jobDescription: jobDescription.trim(),
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", detail: validation.error.issues },
        { status: 400 }
      );
    }

    const coverLetter = await generateCoverLetter(applicant, resumeText, jobDescription);

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error("Cover letter generation API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}