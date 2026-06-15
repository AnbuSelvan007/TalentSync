"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function EmptyRoadmapState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col items-center justify-center rounded-3xl border bg-card/30 px-8 py-16 shadow-lg backdrop-blur dark:border-zinc-800"
    >
      <div className="rounded-2xl bg-muted p-4">
        <MapPin className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">No roadmap generated yet.</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Configure your goal, skill level, and timeline above to generate a personalized learning roadmap.
      </p>
    </motion.div>
  );
}