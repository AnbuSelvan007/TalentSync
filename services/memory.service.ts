import { connectDB } from "@/lib/db/connection";
import Memory from "@/models/Memory";
import mongoose from "mongoose";

/**
 * Service for managing user memories with strict userId scoping.
 * Every operation MUST verify the userId belongs to the current session user.
 */

/**
 * Get all memories for a specific user (for the AI Memory settings page).
 */
export async function getUserMemories(userId: string) {
  await connectDB();

  const memories = await Memory.find({ userId: new mongoose.Types.ObjectId(userId) })
    .select("content type metadata createdAt")
    .sort({ createdAt: -1 })
    .lean();

  return memories;
}

/**
 * Delete a single memory by ID, ensuring it belongs to the given userId.
 * Returns null if the memory doesn't exist or doesn't belong to the user.
 */
export async function deleteUserMemory(memoryId: string, userId: string) {
  await connectDB();

  const memory = await Memory.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(memoryId),
    userId: new mongoose.Types.ObjectId(userId),
  }).lean();

  return memory;
}

/**
 * Delete all memories for a specific user.
 * Used when a user wants to clear their AI memory.
 */
export async function clearUserMemories(userId: string) {
  await connectDB();

  const result = await Memory.deleteMany({
    userId: new mongoose.Types.ObjectId(userId),
  });

  return result.deletedCount;
}

/**
 * Get memory count for a user.
 */
export async function getUserMemoryCount(userId: string) {
  await connectDB();

  return Memory.countDocuments({
    userId: new mongoose.Types.ObjectId(userId),
  });
}