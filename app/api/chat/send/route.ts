import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { connectDB } from "@/lib/db/connection";
import Message from "@/models/Message";
import {
  addMessage,
  generateRAGResponse,
  ChatAccessError,
} from "@/services/chat.service";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { chatId, message } = await req.json();

    if (!chatId || !message) {
      return NextResponse.json(
        { error: "chatId and message are required" },
        { status: 400 }
      );
    }

    await addMessage(chatId, userId, "user", message);

    const aiResponse = await generateRAGResponse(userId, chatId, message);

    const savedAiMessage = await addMessage(chatId, userId, "assistant", aiResponse);

    return NextResponse.json({
      message: savedAiMessage,
      content: aiResponse,
    });
  } catch (error) {
    if (error instanceof ChatAccessError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    console.error("[Chat Send API] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/chat/send — Edit a user message and re-generate AI response
 * Body: { chatId, userMessageId, newContent }
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { chatId, userMessageId, newContent } = await req.json();

    if (!chatId || !userMessageId || !newContent) {
      return NextResponse.json(
        { error: "chatId, userMessageId, and newContent are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // 1. Update the user message content in DB
    const updatedMessage = await Message.findOneAndUpdate(
      { _id: userMessageId, chatId, role: "user" },
      { content: newContent.trim() },
      { new: true }
    );

    if (!updatedMessage) {
      return NextResponse.json(
        { error: "Message not found or not editable" },
        { status: 404 }
      );
    }

    // 2. Delete all assistant messages that came after this user message
    await Message.deleteMany({
      chatId,
      role: "assistant",
      createdAt: { $gt: updatedMessage.createdAt || new Date() },
    });

    // 3. Generate a new AI response
    const aiResponse = await generateRAGResponse(userId, chatId, newContent.trim());

    // 4. Save the new assistant response
    const savedAiMessage = await addMessage(chatId, userId, "assistant", aiResponse);

    return NextResponse.json({
      userMessage: updatedMessage,
      message: savedAiMessage,
      content: aiResponse,
    });
  } catch (error) {
    if (error instanceof ChatAccessError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    console.error("[Chat Edit API] Error:", error);
    return NextResponse.json(
      { error: "Failed to edit message" },
      { status: 500 }
    );
  }
}
