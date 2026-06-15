import { connectDB } from "@/lib/db/connection";
import JobMatchModel from "@/models/JobMatch";
import mongoose from "mongoose";

export async function saveJobMatch(userId: string, data: {
  company: string;
  role: string;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  suggestions: string[];
}) {
  await connectDB();
  return JobMatchModel.create({ userId: new mongoose.Types.ObjectId(userId), ...data });
}

export async function getJobMatches(userId: string) {
  await connectDB();
  return JobMatchModel.find({ userId }).sort({ createdAt: -1 }).lean();
}

export async function getJobMatchById(jobMatchId: string) {
  await connectDB();
  return JobMatchModel.findById(jobMatchId).lean();
}