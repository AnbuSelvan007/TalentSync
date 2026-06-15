"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  FileText,
  Mic,
  Map,
  PenLine,
  ArrowRight,
  Sparkles,
  Briefcase,
  Target,
} from "lucide-react";
import Link from "next/link";

interface Stats {
  totalChats: number;
  totalResumes: number;
  totalInterviews: number;
  totalRoadmaps: number;
  totalCoverLetters: number;
  recentActivity: { type: string; label: string; timestamp: Date }[];
}

const statCards = [
  { key: "totalChats", label: "Total Chats", icon: MessageSquare, color: "text-violet-500", href: "/chat" },
  { key: "totalResumes", label: "Resume Reviews", icon: FileText, color: "text-emerald-500", href: "/resume-review" },
  { key: "totalInterviews", label: "Interviews Completed", icon: Mic, color: "text-amber-500", href: "/mock-interview" },
  { key: "totalRoadmaps", label: "Roadmaps Generated", icon: Map, color: "text-blue-500", href: "/roadmap" },
  { key: "totalCoverLetters", label: "Cover Letters Created", icon: PenLine, color: "text-rose-500", href: "/cover-letter" },
] as const;

const quickActions = [
  { label: "Resume Review", icon: FileText, href: "/resume-review", desc: "Analyze your resume with AI" },
  { label: "Mock Interview", icon: Mic, href: "/mock-interview", desc: "Practice with AI interview" },
  { label: "Roadmap Generator", icon: Map, href: "/roadmap", desc: "Plan your learning path" },
  { label: "Job Match Analyzer", icon: Briefcase, href: "/job-match", desc: "Match your resume to jobs" },
  { label: "Cover Letter Generator", icon: PenLine, href: "/cover-letter", desc: "Generate tailored letters" },
];

const activityIcons: Record<string, React.ElementType> = {
  resume: FileText,
  interview: Mic,
  roadmap: Map,
};

const activityColors: Record<string, string> = {
  resume: "bg-emerald-500/10 text-emerald-500",
  interview: "bg-amber-500/10 text-amber-500",
  roadmap: "bg-blue-500/10 text-blue-500",
};

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function DashboardClient({ stats, userName }: { stats: Stats; userName: string }) {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">{userName}</span>
        </h1>
        <p className="text-muted-foreground">
          Your AI career dashboard — track your progress and take the next step.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          const value = stats[card.key as keyof Stats] as number;
          return (
            <Link key={card.key} href={card.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="group cursor-pointer rounded-3xl border bg-card/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between">
                  <Icon className={`h-5 w-5 ${card.color}`} />
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100" />
                </div>
                <p className="mt-4 text-3xl font-bold">{value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl border bg-card/80 p-6 shadow-sm backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          {stats.recentActivity.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Target className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No activity yet. Start by reviewing a resume or generating a roadmap.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentActivity.map((activity, idx) => {
                const Icon = activityIcons[activity.type] || FileText;
                const color = activityColors[activity.type] || "bg-muted text-muted-foreground";
                return (
                  <div key={idx} className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted/50">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{activity.label}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl border bg-card/80 p-6 shadow-sm backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <div className="group flex items-start gap-3 rounded-xl border bg-background/50 p-4 transition-all hover:border-primary/30 hover:bg-background dark:border-zinc-800">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{action.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{action.desc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}