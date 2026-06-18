import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { deleteUserMemory } from "@/services/memory.service";

/**
 * DELETE /api/memory/[id] - Delete a single memory by ID (must belong to current user)
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = session.user.id;

    const deleted = await deleteUserMemory(id, userId);
    if (!deleted) {
      return NextResponse.json(
        { error: "Memory not found or does not belong to you" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Memory deleted successfully" });
  } catch (error) {
    console.error("[Memory Delete API] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete memory" },
      { status: 500 }
    );
  }
}