"use client";

import { Menu, Plus, Sparkles } from "lucide-react";

interface ChatHeaderProps {
  onHistoryClick?: () => void;
  onNewChat?: () => void;
  title?: string;
}

export default function ChatHeader({ onHistoryClick, onNewChat, title }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b px-4 py-2.5 md:px-6">
      <div className="flex items-center gap-2">
        <button
          onClick={onHistoryClick}
          aria-label="Chat history"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
        >
          <Menu className="h-3.5 w-3.5" />
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">{title || "New Chat"}</h2>
        </div>
      </div>
      <button
        onClick={onNewChat}
        aria-label="New chat"
        className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Plus className="h-3.5 w-3.5" />
        New Chat
      </button>
    </div>
  );
}