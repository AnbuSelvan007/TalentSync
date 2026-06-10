"use client";

import { Download } from "lucide-react";

import { useChatStore } from "@/store/chat-store";

export default function ExportChatButton() {
  const { messages } =
    useChatStore();

  const exportChat = () => {
    const content =
      messages
        .map(
          (msg) =>
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