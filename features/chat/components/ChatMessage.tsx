"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Bot, User, Pencil, X, SendHorizonal } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Message } from "../types/chat.types";

interface Props {
  message: Message;
  onEdit?: (messageId: string, oldContent: string, newContent: string) => Promise<void>;
}

export default function ChatMessage({ message, onEdit }: Props) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(editContent.length, editContent.length);
    }
  }, [isEditing, editContent.length]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_err) {
      console.error("Copy failed", _err);
    }
  };

  const handleEditStart = () => {
    setEditContent(message.content);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleEditSave = async () => {
    const trimmed = editContent.trim();
    if (!trimmed || trimmed === message.content || !onEdit) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onEdit(message.id, message.content, trimmed);
    } catch (err) {
      console.error("[ChatMessage] Failed to edit message:", err);
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleEditSave();
    }
    if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Bot className="h-3 w-3 text-primary" />
        </div>
      )}

      <div
        className={`max-w-lg rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "border bg-card"
        }`}
      >
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea
              ref={textareaRef}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full min-h-[60px] bg-transparent text-sm outline-none resize-none border-b border-primary/30 pb-1"
              disabled={isSaving}
              rows={3}
            />
            <div className="flex items-center justify-end gap-1">
              <button
                onClick={handleEditCancel}
                disabled={isSaving}
                className="flex h-6 w-6 items-center justify-center rounded text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                aria-label="Cancel edit"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => void handleEditSave()}
                disabled={isSaving || !editContent.trim()}
                className="flex h-6 w-6 items-center justify-center rounded text-primary-foreground/60 hover:text-primary-foreground transition-colors disabled:opacity-40"
                aria-label="Save edit"
              >
                <SendHorizonal className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  if (match) {
                    return (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ fontSize: "0.8rem", borderRadius: "0.5rem", margin: "0.5rem 0" }}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    );
                  }
                  return <code className="rounded bg-muted px-1 py-0.5 text-xs">{children}</code>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>

            <div className="mt-1 flex items-center gap-2">
              {isUser && onEdit && (
                <button
                  onClick={handleEditStart}
                  className="flex items-center gap-1 text-[10px] text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                  aria-label="Edit message"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </button>
              )}
              {!isUser && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground/60 transition-colors hover:text-muted-foreground"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {isUser && (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/20">
          <User className="h-3 w-3 text-primary" />
        </div>
      )}
    </motion.div>
  );
}