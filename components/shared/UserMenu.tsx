"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, ChevronDown } from "lucide-react";

export default function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  if (!session?.user) return null;

  const name = session.user.name || "User";
  const email = session.user.email || "";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="User menu"
        className="flex items-center gap-2 rounded-2xl p-2 transition-colors hover:bg-muted"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-xs font-semibold text-primary">
          {initial}
        </div>
        <span className="hidden text-sm font-medium lg:inline">{name}</span>
        <ChevronDown className={`hidden h-3.5 w-3.5 text-muted-foreground transition-transform lg:block ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border bg-card shadow-xl"
            >
              <div className="border-b px-4 py-3">
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-muted-foreground truncate">{email}</p>
              </div>
              <div className="p-1.5">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}