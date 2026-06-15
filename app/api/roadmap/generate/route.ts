import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, unauthorized } from "@/lib/auth/session";
import { generateRoadmapAction } from "@/features/roadmap/actions/generate-roadmap";
import { saveRoadmap } from "@/services/roadmap.service";

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

    await saveRoadmap(userId, { goal, timeline, roadmap: result as unknown as Record<string, unknown> });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Roadmap API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
