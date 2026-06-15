"use client";

import { Download } from "lucide-react";

import { useChatStore } from "@/store/chat-store";

export default function ExportChatButton() {
  const chats = useChatStore((s) => s.chats);
  const currentChatId = useChatStore((s) => s.currentChatId);

  const exportChat = () => {
    const currentChat = chats.find((c) => c.id === currentChatId);
    const messages = currentChat?.messages || [];

    const content =
      messages
        .map(
          (msg: { role: string; content: string }) =>
            `${msg.role.toUpperCase()}:\n${msg.content}\n`
        )
        .join("\n----------------\n");

    const blob = new Blob(
      [content],
      {
        type: "text/plain",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download =
      "talentsync-chat.txt";

    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={exportChat}
      className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
    >
      <Download size={16} />
      Export Chat
    </button>
  );
}