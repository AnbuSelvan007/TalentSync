import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, unauthorized } from "@/lib/auth/session";
import { getChatById, deleteChat } from "@/services/chat.service";
import { getMessages as getChatMessages } from "@/lib/db/queries/chat";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();

    const { id } = await params;
    const chat = await getChatById(id);
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const messages = await getChatMessages(id);
    const mappedMessages = messages.map((msg: any) => ({
      id: msg._id.toString(),
      role: msg.role,
      content: msg.content,
      createdAt: msg.createdAt?.toISOString?.() ?? new Date().toISOString(),
    }));

    return NextResponse.json({
      id: chat._id.toString(),
      title: chat.title,
      messages: mappedMessages,
      createdAt: chat.createdAt?.toISOString?.() ?? new Date().toISOString(),
      updatedAt: chat.updatedAt?.toISOString?.() ?? new Date().toISOString(),
    });
  } catch (error) {
    console.error("GET /api/chat/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();

    const { id } = await params;
    await deleteChat(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/chat/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}