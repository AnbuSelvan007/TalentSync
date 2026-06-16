import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, unauthorized } from "@/lib/auth/session";
import { createChat, getUserChats } from "@/services/chat.service";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();

    const chats = await getUserChats(userId);

    // Map MongoDB _id to id and ensure messages array exists
    const mapped = chats.map((chat: any) => ({
      id: chat._id.toString(),
      title: chat.title,
      messages: [],
      createdAt: chat.createdAt?.toISOString?.() ?? new Date().toISOString(),
      updatedAt: chat.updatedAt?.toISOString?.() ?? new Date().toISOString(),
    }));

    return NextResponse.json({ chats: mapped });
  } catch (error) {
    console.error("GET /api/chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();

    const body = await request.json().catch(() => ({}));
    const title = body.title || "New Chat";

    const chat = await createChat(userId, title);

    return NextResponse.json({
      id: chat._id.toString(),
      title: chat.title,
      messages: [],
      createdAt: chat.createdAt?.toISOString?.() ?? new Date().toISOString(),
      updatedAt: chat.updatedAt?.toISOString?.() ?? new Date().toISOString(),
    });
  } catch (error) {
    console.error("POST /api/chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}