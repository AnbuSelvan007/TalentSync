import { connectDB } from "@/lib/db/connection";
import RoadmapModel from "@/models/Roadmap";
import mongoose from "mongoose";

export async function saveRoadmap(userId: string, data: {
  goal: string;
  timeline: string;
  roadmap: Record<string, unknown>;
}) {
  await connectDB();
  // Keep only the latest — delete old, create new
  await RoadmapModel.deleteMany({ userId });
  return RoadmapModel.create({ userId: new mongoose.Types.ObjectId(userId), ...data });
}

export async function getLatestRoadmap(userId: string) {
  await connectDB();
  return RoadmapModel.findOne({ userId }).sort({ createdAt: -1 }).lean();
}

export async function getRoadmaps(userId: string) {
  await connectDB();
  return RoadmapModel.find({ userId }).sort({ createdAt: -1 }).lean();
}

export async function getRoadmapById(roadmapId: string) {
  await connectDB();
  return RoadmapModel.findById(roadmapId).lean();
}