"use client";

import { motion } from "framer-motion";
import { Play, BookOpen, Code, ExternalLink } from "lucide-react";
import type { RoadmapResource } from "@/features/roadmap/types/roadmap.types";

interface Props {
  resources: RoadmapResource[];
}

const resourceConfig = {
  video: {
    icon: Play,
    label: "Video Tutorial",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  article: {
    icon: BookOpen,
    label: "Article",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  practice: {
    icon: Code,
    label: "Practice",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  documentation: {
    icon: BookOpen,
    label: "Documentation",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
};

export default function ResourcesCard({ resources }: Props) {
  if (!resources || resources.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Resources
      </p>
      <div className="flex flex-wrap gap-2">
        {resources.map((resource, idx) => {
          const config = resourceConfig[resource.type] || resourceConfig.article;
          const Icon = config.icon;

          return (
            <motion.a
              key={`${resource.title}-${idx}`}
              href={resource.url || "#"}
              target={resource.url ? "_blank" : undefined}
              rel={resource.url ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${config.bg} ${config.color} hover:opacity-80`}
            >
              <Icon className="h-3.5 w-3.5" />
              {resource.title}
              {resource.url && <ExternalLink className="h-3 w-3" />}
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}