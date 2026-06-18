"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useChatStore } from "@/store/chat-store";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import RecentChats from "./RecentChats";
import ChatWelcome from "./ChatWelcome";
import TypingIndicator from "./TypingIndicator";

export default function ChatContainer() {
  const { data: session, status } = useSession();
  const {
    chats,
    currentChatId,
    isHydrated,
    isLoading: isLoadingChats,
    setUserId,
    loadChats,
    createChat,
    addMessage,
  } = useChatStore();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const currentChat = chats.find((c) => c.id === currentChatId);
  const messages = currentChat?.messages ?? [];

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      setUserId(session.user.id);
      void loadChats();
      return;
    }

    if (status === "unauthenticated") {
      setUserId(null);
    }
  }, [status, session?.user?.id, setUserId, loadChats]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Cleanup AbortController on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleNewChat = useCallback(async () => {
    try {
      await createChat();
    } catch (err) {
      console.error("[ChatContainer] Failed to create chat:", err);
      setError("Failed to create a new chat. Please try again.");
    }
  }, [createChat]);

  const handleStop = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsSending(false);
  }, []);

  const handleSend = useCallback(async (content: string) => {
    if (!currentChatId || isSending) return;

    // Create a new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMsgId = crypto.randomUUID();
    addMessage({ id: userMsgId, role: "user", content, createdAt: new Date().toISOString() });

    setIsSending(true);
    setError(null);

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: currentChatId, message: content }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }

      const data = await res.json();
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.content || data.message?.content || "",
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      // Don't show error if it was aborted (user clicked stop)
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      const message = err instanceof Error ? err.message : "Failed to get response";
      setError(message);
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again later.",
        createdAt: new Date().toISOString(),
      });
    } finally {
      setIsSending(false);
      abortControllerRef.current = null;
    }
  }, [currentChatId, isSending, addMessage]);

  const handleEditMessage = useCallback(async (userMessageId: string, oldContent: string, newContent: string) => {
    if (!currentChatId || !newContent.trim() || newContent === oldContent) return;

    setIsSending(true);
    setError(null);

    try {
      const res = await fetch("/api/chat/send", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: currentChatId,
          userMessageId,
          newContent: newContent.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to edit message");
      }

      const data = await res.json();

      // Reload chats to get the updated state from the server
      await loadChats();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to edit message";
      setError(message);
    } finally {
      setIsSending(false);
    }
  }, [currentChatId, loadChats]);

  if (status === "loading" || !isHydrated || isLoadingChats) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center text-sm text-muted-foreground">
        Loading your chats...
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <RecentChats open={historyOpen} onClose={() => setHistoryOpen(false)} onNewChat={handleNewChat} />

      <div className="flex flex-1 flex-col">
        <ChatHeader
          onHistoryClick={() => setHistoryOpen(true)}
          onNewChat={handleNewChat}
          title={currentChat?.title}
        />

        {messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <ChatWelcome onSuggestionClick={(prompt) => handleSend(prompt)} />
          </div>
        ) : (
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
            <div className="mx-auto max-w-2xl space-y-3">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onEdit={msg.role === "user" ? handleEditMessage : undefined}
                />
              ))}
              {isSending && <TypingIndicator />}
              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-500">
                  {error}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="border-t bg-background/80 backdrop-blur-xl">
          <div className="mx-auto max-w-2xl px-4 py-3 md:px-6">
            <ChatInput onSend={handleSend} onStop={handleStop} isLoading={isSending} />
          </div>
        </div>
      </div>
    </div>
  );
}