"use client";

import { useState, useEffect, useRef } from "react";

import { useChatStore } from "@/store/chat-store";

import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import ChatWelcome from "./ChatWelcome";
import TypingIndicator from "./TypingIndicator";

import { generateAIResponse } from "../services/chat.service";

export default function ChatContainer() {
  const { messages, setMessages } = useChatStore();

  const [isLoading, setIsLoading] =
    useState(false);

  const bottomRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const handleSend = async (
    content: string
  ) => {
    const userMessage = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content,
    };

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(updatedMessages);

    try {
      setIsLoading(true);

      const aiResponse =
        await generateAIResponse(content);

      const assistantMessage = {
        id: crypto.randomUUID(),
        role: "assistant" as const,
        content:
          aiResponse ||
          "No response received.",
      };

      setMessages([
        ...updatedMessages,
        assistantMessage,
      ]);
    } catch (error) {
      console.error(error);

      const errorMessage = {
        id: crypto.randomUUID(),
        role: "assistant" as const,
        content:
          "TalentSync AI is currently busy. Please try again.",
      };

      setMessages([
        ...updatedMessages,
        errorMessage,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <ChatHeader />

      <div className="flex-1 overflow-auto">
        {messages.length === 0 ? (
          <ChatWelcome
            onSuggestionClick={(
              prompt
            ) => {
              handleSend(prompt);
            }}
          />
        ) : (
          <div className="mx-auto max-w-4xl space-y-4 p-6">
            {messages.map(
              (message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                />
              )
            )}

            {isLoading && (
              <TypingIndicator />
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <ChatInput
        onSend={handleSend}
        isLoading={isLoading}
      />
    </div>
  );
}