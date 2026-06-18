"use client";

import { MessageSquare, Plus, Trash2, Pencil, X, Check } from "lucide-react";
import { useChatStore } from "@/store/chat-store";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

interface RecentChatsProps {
  open: boolean;
  onClose: () => void;
  onNewChat: () => void | Promise<void>;
}

function ChatItem({
  chat,
  isActive,
  onSelect,
}: {
  chat: { id: string; title: string };
  isActive: boolean;
  onSelect: () => void;
}) {
  const { deleteChat, updateChatTitle } = useChatStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(chat.title);
  const [showActions, setShowActions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== chat.title) {
      try {
        await updateChatTitle(chat.id, trimmed);
      } catch (error) {
        console.error("[RecentChats] Failed to update title:", error);
      }
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(chat.title);
    setIsEditing(false);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete "${chat.title}"? This cannot be undone.`)) return;
    try {
      await deleteChat(chat.id);
    } catch (error) {
      console.error("[RecentChats] Failed to delete chat:", error);
    }
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {isEditing ? (
        <div className="flex items-center gap-1 rounded-xl px-3 py-2">
          <MessageSquare className="h-3 w-3 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            className="flex-1 bg-transparent text-xs outline-none border-b border-primary"
            maxLength={100}
          />
          <button
            onClick={(e) => { e.stopPropagation(); void handleSave(); }}
            className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-green-500"
            aria-label="Save"
          >
            <Check className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleCancel(); }}
            className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-red-500"
            aria-label="Cancel"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            onSelect();
          }}
          className={cn(
            "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs transition-colors",
            isActive
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <MessageSquare className="h-3 w-3 shrink-0" />
          <span className="flex-1 truncate">{chat.title}</span>

          {/* Action buttons - visible on hover (desktop) or always visible on mobile & active chat */}
          <span
            className={cn(
              "flex items-center gap-0.5 shrink-0 transition-opacity",
              "md:opacity-0 md:group-hover:opacity-100",
              (showActions || isActive) && "md:opacity-100"
            )}
          >
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                setEditTitle(chat.title);
                setIsEditing(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setEditTitle(chat.title);
                  setIsEditing(true);
                }
              }}
              className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground"
              aria-label="Rename chat"
            >
              <Pencil className="h-3 w-3" />
            </span>
            <span
              role="button"
              tabIndex={0}
              onClick={handleDelete}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleDelete(e as unknown as React.MouseEvent);
              }}
              className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-red-500"
              aria-label="Delete chat"
            >
              <Trash2 className="h-3 w-3" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

export default function RecentChats({ open, onClose, onNewChat }: RecentChatsProps) {
  const { chats, currentChatId, switchChat } = useChatStore();

  const handleSelect = (chatId: string) => {
    switchChat(chatId);
    onClose();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-3 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          History
        </span>
        <button
          onClick={() => void onNewChat()}
          aria-label="New chat"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === currentChatId}
            onSelect={() => handleSelect(chat.id)}
          />
        ))}
        {chats.length === 0 && (
          <p className="px-3 py-4 text-xs text-muted-foreground text-center">
            No conversations yet
          </p>
        )}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop history sidebar */}
      <aside className="hidden md:flex md:w-56 md:flex-col md:border-r">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden" onClick={onClose} />
          <aside className="fixed inset-y-0 left-0 z-50 w-56 border-r bg-card md:hidden">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}