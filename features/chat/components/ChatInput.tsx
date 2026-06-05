"use client";

import { useState, KeyboardEvent } from "react";
import { SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export default function ChatInput({
  onSend,
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

          <Button
            size="icon"
            onClick={handleSend}
            disabled={
              !message.trim() || isLoading
            }
            className="absolute bottom-3 right-3 rounded-xl"
          >
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}