import { connectDB } from "@/lib/db/connection";
import CoverLetterModel from "@/models/CoverLetter";
import mongoose from "mongoose";

export async function saveCoverLetter(userId: string, data: {
  company: string;
  role: string;
  applicantName: string;
  content: string;
}) {
  await connectDB();
  // Keep only the latest — delete old, create new
  await CoverLetterModel.deleteMany({ userId });
  return CoverLetterModel.create({ userId: new mongoose.Types.ObjectId(userId), ...data });
}

export async function getLatestCoverLetter(userId: string) {
  await connectDB();
  return CoverLetterModel.findOne({ userId }).sort({ createdAt: -1 }).lean();
}

export async function getCoverLetters(userId: string) {
  await connectDB();
  return CoverLetterModel.find({ userId }).sort({ createdAt: -1 }).lean();
}

export async function getCoverLetterById(coverLetterId: string) {
  await connectDB();
  return CoverLetterModel.findById(coverLetterId).lean();
}