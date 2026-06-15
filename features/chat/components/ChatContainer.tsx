"use client";

import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/store/chat-store";
import { motion } from "framer-motion";
import { MessageSquare, Plus } from "lucide-react";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import RecentChats from "./RecentChats";
import ChatWelcome from "./ChatWelcome";

export default function ChatContainer() {
  const { chats, currentChatId, createChat, addMessage } = useChatStore();
  const [historyOpen, setHistoryOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find((c) => c.id === currentChatId);
  const messages = currentChat?.messages ?? [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (content: string) => {
    addMessage({ id: crypto.randomUUID(), role: "user", content, createdAt: new Date().toISOString() });
    // Simulated AI response — replace with actual API call
    setTimeout(() => {
      addMessage({ id: crypto.randomUUID(), role: "assistant", content: "I'm an AI assistant. This is a simulated response.", createdAt: new Date().toISOString() });
    }, 500);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Recent Chats Sidebar */}
      <RecentChats open={historyOpen} onClose={() => setHistoryOpen(false)} />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <ChatHeader
          onHistoryClick={() => setHistoryOpen(true)}
          onNewChat={createChat}
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
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t bg-background/80 backdrop-blur-xl">
          <div className="mx-auto max-w-2xl px-4 py-3 md:px-6">
            <ChatInput onSend={handleSend} />
          </div>
        </div>
      </div>
    </div>
  );
}