import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, unauthorized } from "@/lib/auth/session";
import { getChatById, addMessage, updateChatTitle } from "@/services/chat.service";
import { ai } from "@/lib/ai/gemini";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { getMessages as getChatMessages } from "@/lib/db/queries/chat";
import { buildConversationContext } from "@/lib/ai/context-manager";

export async function POST(
  request: NextRequest,
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

    const { content } = await request.json();
    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    // Save user message to DB
    const userMessage = await addMessage(id, "user", content.trim());

    // Fetch all previous messages for context
    const previousMessages = await getChatMessages(id);
    const context = buildConversationContext(
      previousMessages.map((m: any) => ({ role: m.role, content: m.content })),
      content
    );

    // Call Gemini AI
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
${SYSTEM_PROMPT}

${context}
`,
    });

    const aiContent = response.text ?? "Sorry, I couldn't process that request.";

    // Save AI response to DB
    const aiMessage = await addMessage(id, "assistant", aiContent);

    // Auto-generate/update chat title from first user message
    if (chat.title === "New Chat") {
      const titleSuggestion = content.trim().slice(0, 50) + (content.length > 50 ? "..." : "");
      await updateChatTitle(id, titleSuggestion);
    }

    return NextResponse.json({
      userMessage: {
        id: userMessage._id.toString(),
        role: userMessage.role,
        content: userMessage.content,
        createdAt: userMessage.createdAt?.toISOString?.() ?? new Date().toISOString(),
      },
      aiMessage: {
        id: aiMessage._id.toString(),
        role: aiMessage.role,
        content: aiMessage.content,
        createdAt: aiMessage.createdAt?.toISOString?.() ?? new Date().toISOString(),
      },
      updatedTitle: chat.title === "New Chat" ? content.trim().slice(0, 50) + (content.length > 50 ? "..." : "") : undefined,
    });
  } catch (error) {
    console.error("POST /api/chat/[id]/messages error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}