import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, unauthorized } from "@/lib/auth/session";
import { generateRoadmapAction } from "@/features/roadmap/actions/generate-roadmap";
import { saveRoadmap, getAllRoadmaps, getRoadmapById, deleteRoadmapById } from "@/services/roadmap.service";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();

    const roadmaps = await getAllRoadmaps(userId);
    return NextResponse.json({ roadmaps });
  } catch (error) {
    console.error("GET /api/roadmap/generate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();

    const body = await request.json();
    const { goal, skillLevel, timeline } = body;

    if (!goal || !skillLevel || !timeline) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await generateRoadmapAction(goal, skillLevel, timeline);

    const saved = await saveRoadmap(userId, { goal, timeline, roadmap: result as unknown as Record<string, unknown> });

    return NextResponse.json({
      id: saved._id.toString(),
      goal,
      timeline,
      roadmap: result,
      createdAt: saved.createdAt?.toISOString?.() ?? new Date().toISOString(),
    });
  } catch (error) {
    console.error("Roadmap API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Roadmap ID is required" }, { status: 400 });
    }

    const roadmap = await getRoadmapById(id);
    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    await deleteRoadmapById(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/roadmap/generate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}