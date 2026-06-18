import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { getUserMemories, clearUserMemories, getUserMemoryCount } from "@/services/memory.service";

/**
 * GET /api/memory - Get all memories for the current user
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const memories = await getUserMemories(userId);
    const count = await getUserMemoryCount(userId);

    return NextResponse.json({ memories, count });
  } catch (error) {
    console.error("[Memory API] Error fetching memories:", error);
    return NextResponse.json(
      { error: "Failed to fetch memories" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/memory - Clear all memories for the current user
 */
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const deletedCount = await clearUserMemories(userId);

    return NextResponse.json({
      message: "All memories cleared",
      deletedCount,
    });
  } catch (error) {
    console.error("[Memory API] Error clearing memories:", error);
    return NextResponse.json(
      { error: "Failed to clear memories" },
      { status: 500 }
    );
  }
}