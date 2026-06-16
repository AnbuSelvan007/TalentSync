"use client";

import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { useChatStore } from "@/store/chat-store";
import { cn } from "@/lib/utils";

interface RecentChatsProps {
  open: boolean;
  onClose: () => void;
  onDeleteChat?: (chatId: string) => void;
}

export default function RecentChats({ open, onClose, onDeleteChat }: RecentChatsProps) {
  const { chats, currentChatId, switchChat } = useChatStore();

  return (
    <>
      {/* Desktop history sidebar */}
      <aside className="hidden md:flex md:w-56 md:flex-col md:border-r">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-3 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              History
            </span>
          </div>
          <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
            {chats.length === 0 && (
              <p className="px-3 py-4 text-xs text-muted-foreground text-center">
                No chats yet
              </p>
            )}
            {chats.map((chat) => (
              <div key={chat.id} className="group flex items-center">
                <button
                  onClick={() => {
                    switchChat(chat.id);
                    onClose();
                  }}
                  className={cn(
                    "flex flex-1 items-center gap-2 rounded-l-xl px-3 py-2 text-left text-xs transition-colors",
                    chat.id === currentChatId
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <MessageSquare className="h-3 w-3 shrink-0" />
                  <span className="truncate">{chat.title}</span>
                </button>
                {onDeleteChat && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    aria-label="Delete chat"
                    className="flex h-7 w-7 items-center justify-center rounded-r-xl text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
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
              </div>
              <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
                {chats.length === 0 && (
                  <p className="px-3 py-4 text-xs text-muted-foreground text-center">
                    No chats yet
                  </p>
                )}
                {chats.map((chat) => (
                  <div key={chat.id} className="group flex items-center">
                    <button
                      onClick={() => {
                        switchChat(chat.id);
                        onClose();
                      }}
                      className={cn(
                        "flex flex-1 items-center gap-2 rounded-l-xl px-3 py-2 text-left text-xs transition-colors",
                        chat.id === currentChatId
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <MessageSquare className="h-3 w-3 shrink-0" />
                      <span className="truncate">{chat.title}</span>
                    </button>
                    {onDeleteChat && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chat.id);
                        }}
                        aria-label="Delete chat"
                        className="flex h-7 w-7 items-center justify-center rounded-r-xl text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </aside>
        </>
      )}
    </>
  );
}