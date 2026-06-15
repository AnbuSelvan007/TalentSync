"use client";

import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { useChatStore } from "@/store/chat-store";
import { cn } from "@/lib/utils";

interface RecentChatsProps {
  open: boolean;
  onClose: () => void;
}

export default function RecentChats({ open, onClose }: RecentChatsProps) {
  const { chats, currentChatId, switchChat, createChat } = useChatStore();

  return (
    <>
      {/* Desktop history sidebar */}
      <aside className="hidden md:flex md:w-56 md:flex-col md:border-r">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-3 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              History
            </span>
            <button
              onClick={createChat}
              aria-label="New chat"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  switchChat(chat.id);
                  onClose();
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs transition-colors",
                  chat.id === currentChatId
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <MessageSquare className="h-3 w-3 shrink-0" />
                <span className="truncate">{chat.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden" onClick={onClose} />
          <aside className="fixed inset-y-0 left-0 z-50 w-56 border-r bg-card md:hidden">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b px-3 py-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  History
                </span>
                <button
                  onClick={createChat}
                  aria-label="New chat"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      switchChat(chat.id);
                      onClose();
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs transition-colors",
                      chat.id === currentChatId
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <MessageSquare className="h-3 w-3 shrink-0" />
                    <span className="truncate">{chat.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        </>
      )}
    </>
  );
}