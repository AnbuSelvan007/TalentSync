"use client";

import { motion } from "framer-motion";
import { AlertTriangle, XCircle } from "lucide-react";

interface Props {
  skills: string[];
}

export default function MissingSkillsCard({ skills }: Props) {
  return (
    <div className="rounded-3xl border bg-gradient-to-br from-red-500/5 to-orange-500/5 p-6 shadow-sm transition-all hover:shadow-md dark:border-red-900/30">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-red-100 p-2.5 dark:bg-red-900/30">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-semibold">Missing Skills</h3>
        {skills.length > 0 && (
          <span className="ml-auto rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {skills.length}
          </span>
        )}
      </div>

      {skills.length === 0 ? (
        <p className="text-sm text-muted-foreground">No missing skills identified.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <motion.span
              key={skill + i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300"
            >
              <XCircle className="h-3.5 w-3.5" />
              {skill}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
}