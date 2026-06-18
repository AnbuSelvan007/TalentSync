"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Brain, Trash2, Loader2, AlertTriangle, Clock, X, Database } from "lucide-react";

interface Memory {
  _id: string;
  content: string;
  type: string;
  createdAt: string;
}

export default function AIMemorySettings() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [clearingAll, setClearingAll] = useState(false);
  const [error, setError] = useState("");

  const fetchMemories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/memory");
      if (res.ok) {
        const data = await res.json();
        setMemories(data.memories || []);
        setCount(data.count || 0);
      }
    } catch {
      setError("Failed to load memories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  const handleDeleteMemory = async (memoryId: string) => {
    setDeletingId(memoryId);
    try {
      const res = await fetch(`/api/memory/${memoryId}`, { method: "DELETE" });
      if (res.ok) {
        setMemories((prev) => prev.filter((m) => m._id !== memoryId));
        setCount((prev) => prev - 1);
      }
    } catch {
      setError("Failed to delete memory");
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    setClearingAll(true);
    try {
      const res = await fetch("/api/memory", { method: "DELETE" });
      if (res.ok) {
        setMemories([]);
        setCount(0);
      }
    } catch {
      setError("Failed to clear memories");
    } finally {
      setClearingAll(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      chat_memory: "Chat",
      resume_insight: "Resume",
      interview_feedback: "Interview",
      roadmap_goal: "Roadmap",
      career_preference: "Career",
    };
    return labels[type] || type;
  };

  return (
    <div className="rounded-3xl border bg-card/80 p-6 shadow-sm backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">AI Memory</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              TalentSync AI remembers your career goals, preferences, and past conversations to provide personalized responses.
              You can manage your stored memories below.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-xl bg-red-500/10 px-3.5 py-2 text-xs text-red-500">{error}</p>
      )}

      {loading ? (
        <div className="mt-4 flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading memories...</span>
        </div>
      ) : (
        <>
          {/* Memory count and clear button */}
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-muted/50 p-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{count} memory{count !== 1 ? "ies" : "y"} stored</span>
            </div>
            {count > 0 && (
              <button
                onClick={handleClearAll}
                disabled={clearingAll}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-500/10 disabled:opacity-50"
              >
                {clearingAll ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Trash2 className="h-3 w-3" />
                )}
                Clear All
              </button>
            )}
          </div>

          {/* Memory list */}
          {memories.length > 0 ? (
            <div className="mt-4 space-y-2">
              {memories.map((memory) => (
                <motion.div
                  key={memory._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="group relative rounded-2xl border bg-background/50 p-3.5 transition-all hover:bg-background/80"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          {getTypeLabel(memory.type)}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(memory.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-foreground/80 line-clamp-2">
                        {memory.content}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteMemory(memory._id)}
                      disabled={deletingId === memory._id}
                      className="shrink-0 rounded-xl p-2 text-muted-foreground opacity-0 transition-all hover:bg-red-500/10 hover:text-red-500 group-hover:opacity-100 disabled:opacity-50"
                      aria-label="Delete memory"
                    >
                      {deletingId === memory._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <X className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-muted/30 p-6 text-center">
              <Brain className="mx-auto h-8 w-8 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">No memories stored yet.</p>
              <p className="mt-0.5 text-xs text-muted-foreground/60">
                Memories are created automatically when you chat with TalentSync AI.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}