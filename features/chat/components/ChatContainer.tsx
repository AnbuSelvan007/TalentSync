"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useChatStore } from "@/store/chat-store";
import { motion } from "framer-motion";
import { Bot, MessageSquare, Plus } from "lucide-react";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import RecentChats from "./RecentChats";
import ChatWelcome from "./ChatWelcome";
import TypingIndicator from "./TypingIndicator";

export default function ChatContainer() {
  const {
    chats,
    currentChatId,
    isLoading,
    setChats,
    setCurrentChat,
    setLoading,
    createChat,
    removeChat,
    switchChat,
    addMessage,
    updateChatTitle,
  } = useChatStore();

  const [historyOpen, setHistoryOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find((c) => c.id === currentChatId);
  const messages = currentChat?.messages ?? [];

  // Load user's chats from DB on mount
  const loadChats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chat");
      if (!res.ok) throw new Error("Failed to load chats");
      const data = await res.json();
      setChats(data.chats);
    } catch (err) {
      console.error("Failed to load chats:", err);
    } finally {
      setLoading(false);
    }
  }, [setChats, setLoading]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // Load messages when switching to a chat that has no messages yet
  useEffect(() => {
    if (!currentChatId || !currentChat) return;
    // If we have the chat but messages array is empty and it's not a new chat,
    // fetch from DB
    if (currentChat.messages.length === 0 && currentChat.createdAt) {
      fetch(`/api/chat/${currentChatId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.messages?.length > 0) {
            setCurrentChat(data);
          }
        })
        .catch((err) => console.error("Failed to load messages:", err));
    }
  }, [currentChatId, currentChat, setCurrentChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleNewChat = async () => {
    try {
      const res = await fetch("/api/chat", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create chat");
      const chat = await res.json();
      createChat(chat);
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  };

  const handleSend = async (content: string) => {
    let chatId: string | null = currentChatId;

    // Auto-create chat if none exists
    if (!chatId) {
      try {
        const res = await fetch("/api/chat", { method: "POST" });
        if (!res.ok) throw new Error("Failed to create chat");
        const chat = await res.json();
        createChat(chat);
        chatId = chat.id;
      } catch (err) {
        console.error("Failed to create chat:", err);
        return;
      }
    }

    // Optimistically add user message
    const tempUserMsg = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content,
      createdAt: new Date().toISOString(),
    };
    addMessage(tempUserMsg);

    setSending(true);
    try {
      const res = await fetch(`/api/chat/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();

      // Add the persisted AI message
      addMessage(data.aiMessage);

      // Update title if auto-generated
      if (data.updatedTitle) {
        updateChatTitle(chatId!, data.updatedTitle);
      }
    } catch (error) {
      console.error("Send message error:", error);
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: "TalentSync AI is currently unavailable. Please try again later.",
        createdAt: new Date().toISOString(),
      });
    } finally {
      setSending(false);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      const res = await fetch(`/api/chat/${chatId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete chat");
      removeChat(chatId);
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Recent Chats Sidebar */}
      <RecentChats
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onDeleteChat={handleDeleteChat}
      />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <ChatHeader
          onHistoryClick={() => setHistoryOpen(true)}
          onNewChat={handleNewChat}
          title={currentChat?.title}
        />

        {messages.length === 0 ? (
          /* Welcome screen */
          <div className="flex flex-1 items-center justify-center">
            <ChatWelcome
              onSuggestionClick={(prompt) => handleSend(prompt)}
            />
          </div>
        ) : (
          /* Messages */
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
            <div className="mx-auto max-w-2xl space-y-3">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {sending && (
                <div className="flex items-start gap-2.5 justify-start">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Bot className="h-3 w-3 text-primary" />
                  </div>
                  <TypingIndicator />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t bg-background/80 backdrop-blur-xl">
          <div className="mx-auto max-w-2xl px-4 py-3 md:px-6">
            <ChatInput onSend={handleSend} isLoading={sending || isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}