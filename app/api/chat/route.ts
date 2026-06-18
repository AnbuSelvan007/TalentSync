import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import {
  createChat,
  getUserChatsWithMessages,
  deleteChat,
  updateChatTitle,
  ChatAccessError,
} from "@/services/chat.service";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chats = await getUserChatsWithMessages(session.user.id);
    return NextResponse.json({ chats });
  } catch (error) {
    console.error("[Chat API] Error fetching chats:", error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const title = typeof body.title === "string" && body.title.trim()
      ? body.title.trim()
      : "New Chat";

    const chat = await createChat(session.user.id, title);

    return NextResponse.json({
      chat: {
        id: chat._id!.toString(),
        title: chat.title,
        messages: [],
      },
    });
  } catch (error) {
    console.error("[Chat API] Error creating chat:", error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId, title } = await req.json();
    if (!chatId || !title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "chatId and title are required" },
        { status: 400 }
      );
    }

    const chat = await updateChatTitle(chatId, session.user.id, title.trim());

    return NextResponse.json({
      chat: {
        id: chat._id!.toString(),
        title: chat.title,
      },
    });
  } catch (error) {
    if (error instanceof ChatAccessError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    console.error("[Chat API] Error updating chat:", error);
    return NextResponse.json(
      { error: "Failed to update chat" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json(
        { error: "chatId query parameter is required" },
        { status: 400 }
      );
    }

    await deleteChat(chatId, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ChatAccessError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    console.error("[Chat API] Error deleting chat:", error);
    return NextResponse.json(
      { error: "Failed to delete chat" },
      { status: 500 }
    );
  }
}
