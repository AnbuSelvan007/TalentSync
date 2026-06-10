"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Bot, User } from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { Message } from "../types/chat.types";

interface Props {
  message: Message;
}

export default function ChatMessage({
  message,
}: Props) {
  const isUser = message.role === "user";

  const [copied, setCopied] =
    useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        message.content
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.2,
      }}
      className={`flex gap-3 ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      {!isUser && (
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarFallback>
            <Bot size={18} />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-3xl rounded-3xl px-5 py-4 shadow-sm ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "border bg-card"
        }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code(props) {
              const {
                children,
                className,
              } = props;

              const match =
                /language-(\w+)/.exec(
                  className || ""
                );

              return match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                >
                  {String(children).replace(
                    /\n$/,
                    ""
                  )}
                </SyntaxHighlighter>
              ) : (
                <code className="rounded bg-muted px-1 py-0.5">
                  {children}
                </code>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {message.createdAt &&
              new Date(
                message.createdAt
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
          </p>

          {!isUser && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {copied ? (
                <>
                  <Check size={14} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {isUser && (
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarFallback>
            <User size={18} />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
}