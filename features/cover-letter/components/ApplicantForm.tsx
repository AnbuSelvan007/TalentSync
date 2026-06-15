"use client";

import { motion } from "framer-motion";
import { User, Briefcase, Building2, Clock } from "lucide-react";
import type { ApplicantInfo } from "@/features/cover-letter/types/cover-letter.types";

interface Props {
  value: ApplicantInfo;
  onChange: (value: ApplicantInfo) => void;
  disabled?: boolean;
}

export default function ApplicantForm({ value, onChange, disabled }: Props) {
  const updateField = (field: keyof ApplicantInfo, val: string) => {
    onChange({ ...value, [field]: val });
  };

  const fields = [
    { key: "fullName" as const, label: "Full Name", icon: User, placeholder: "John Doe" },
    { key: "role" as const, label: "Role Applying For", icon: Briefcase, placeholder: "Senior Frontend Engineer" },
    { key: "company" as const, label: "Company Name", icon: Building2, placeholder: "Acme Corp" },
    { key: "experience" as const, label: "Years of Experience", icon: Clock, placeholder: "5" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-3xl border bg-card/50 p-6 shadow-lg backdrop-blur transition-all hover:shadow-xl dark:border-zinc-800"
    >
      <div className="mb-5 flex items-center gap-2">
        <div className="rounded-xl bg-primary/10 p-2">
          <User className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Applicant Information</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.key} className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">{field.label}</label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={value[field.key]}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  disabled={disabled}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary disabled:opacity-50 dark:border-zinc-700"
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}