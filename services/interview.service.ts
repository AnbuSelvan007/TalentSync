import { connectDB } from "@/lib/db/connection";
import InterviewModel from "@/models/Interview";
import mongoose from "mongoose";

export async function saveInterview(userId: string, data: {
  role: string;
  difficulty: string;
  questions: string[];
  answers: string[];
  evaluations: Record<string, unknown>[];
  finalScore: number;
}) {
  await connectDB();
  return InterviewModel.create({ userId: new mongoose.Types.ObjectId(userId), ...data });
}

export async function getInterviews(userId: string) {
  await connectDB();
  return InterviewModel.find({ userId }).sort({ createdAt: -1 }).lean();
}

export async function getInterviewById(interviewId: string) {
  await connectDB();
  return InterviewModel.findById(interviewId).lean();
}