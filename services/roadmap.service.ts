import { connectDB } from "@/lib/db/connection";
import RoadmapModel from "@/models/Roadmap";
import mongoose from "mongoose";

export async function saveRoadmap(userId: string, data: {
  goal: string;
  timeline: string;
  roadmap: Record<string, unknown>;
}) {
  await connectDB();
  // Keep ALL history — just create a new entry
  return RoadmapModel.create({ userId: new mongoose.Types.ObjectId(userId), ...data });
}

export async function getAllRoadmaps(userId: string) {
  await connectDB();
  return RoadmapModel.find({ userId }).sort({ createdAt: -1 }).lean();
}

export async function getLatestRoadmap(userId: string) {
  await connectDB();
  return RoadmapModel.findOne({ userId }).sort({ createdAt: -1 }).lean();
}

export async function getRoadmapById(roadmapId: string) {
  await connectDB();
  return RoadmapModel.findById(roadmapId).lean();
}

export async function deleteRoadmapById(roadmapId: string) {
  await connectDB();
  return RoadmapModel.findByIdAndDelete(roadmapId).lean();
}