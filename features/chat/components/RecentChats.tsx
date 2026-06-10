"use client";

import { useChatStore } from "@/store/chat-store";

export default function RecentChats() {
  const {
    chats,
    switchChat,
    currentChatId,
  } = useChatStore();

  return (
    <div className="mt-8">
      <h3 className="mb-4 text-xs font-semibold uppercase text-muted-foreground">
        Recent Chats
      </h3>

      <div className="space-y-2">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() =>
              switchChat(chat.id)
            }
            className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${
              currentChatId ===
              chat.id
                ? "bg-muted"
                : "hover:bg-muted/50"
            }`}
          >
            {chat.title}
          </button>
        ))}
      </div>
    </div>
  );
}