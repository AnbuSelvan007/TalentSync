"use client";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import { useChatStore } from "@/store/chat-store";

import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import ChatWelcome from "./ChatWelcome";
import TypingIndicator from "./TypingIndicator";

import { generateAIResponse } from "../services/chat.service";

export default function ChatContainer() {
  const {
    chats,
    currentChatId,
    addMessage,
  } = useChatStore();

  const currentChat = chats.find(
    (chat) => chat.id === currentChatId
  );

  const messages =
    currentChat?.messages ?? [];

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
      createdAt: new Date().toISOString(),
    };

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    addMessage(userMessage);

    try {
      setIsLoading(true);

      const aiResponse =
        await generateAIResponse(
          content,
          updatedMessages
        );

      const assistantMessage = {
        id: crypto.randomUUID(),
        role: "assistant" as const,
        content:
          aiResponse ||
          "No response received.",
        createdAt: new Date().toISOString(),
      };

      addMessage(
        assistantMessage
      );
    } catch (error) {
      console.error(error);

      const errorMessage = {
        id: crypto.randomUUID(),
        role: "assistant" as const,
        content:
          "TalentSync AI is currently busy. Please try again.",
        createdAt: new Date().toISOString(),
      };

      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">

      <div className="flex-1 overflow-auto">
        {messages.length === 0 ? (
          <ChatWelcome
            onSuggestionClick={
              handleSend
            }
          />
        ) : (
          <div className="mx-auto max-w-5xl space-y-6 p-6">
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