"use client";

import { useState, KeyboardEvent } from "react";
import { SendHorizonal, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isLoading?: boolean;
}

export default function ChatInput({
  onSend,
  onStop,
  isLoading
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isLoading) return;

    onSend(trimmedMessage);
    setMessage("");
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-background p-4">
      <div className="mx-auto max-w-4xl">
        <div className="relative">
          <Textarea
            placeholder="Ask about placements, DSA, interviews, resumes..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={handleKeyDown}
            rows={1}
            className="min-h-[60px] resize-none rounded-2xl pr-14 py-4"
          />

          {isLoading ? (
            <Button
              size="icon"
              onClick={onStop}
              className="absolute bottom-3 right-3 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              aria-label="Stop generating"
            >
              <Square className="h-4 w-4 fill-current" />
            </Button>
          ) : (
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!message.trim()}
              className="absolute bottom-3 right-3 rounded-xl"
            >
              <SendHorizonal className="h-4 w-4" />
            </Button>
          )}
        </div>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          {isLoading
            ? "Generating response..."
            : "Press Enter to send • Shift + Enter for new line"}
        </p>
      </div>
    </div>
  );
}