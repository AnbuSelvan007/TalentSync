import { connectDB } from "@/lib/db/connection";
import ResumeAnalysisModel from "@/models/ResumeAnalysis";
import mongoose from "mongoose";

export async function saveResumeAnalysis(userId: string, data: {
  fileName: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  missingKeywords: string[];
  atsScore: number;
}) {
  await connectDB();
  return ResumeAnalysisModel.create({ userId: new mongoose.Types.ObjectId(userId), ...data });
}

export async function getResumeAnalyses(userId: string) {
  await connectDB();
  return ResumeAnalysisModel.find({ userId }).sort({ createdAt: -1 }).lean();
}

export async function getResumeAnalysisById(analysisId: string) {
  await connectDB();
  return ResumeAnalysisModel.findById(analysisId).lean();
}