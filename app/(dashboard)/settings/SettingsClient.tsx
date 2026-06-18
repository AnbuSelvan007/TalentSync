"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { User, Mail, Lock, LogOut, Trash2, Eye, EyeOff, Loader2, Check, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import AIMemorySettings from "@/features/settings/components/AIMemorySettings";

export default function SettingsClient() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const user = session?.user;

  // Name edit
  const [name, setName] = useState(user?.name || "");
  const [savingName, setSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Delete account
  const [confirmDelete, setConfirmDelete] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleSaveName = async () => {
    if (!name.trim() || name === user?.name) return;
    setSavingName(true);
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        await update();
        setNameSaved(true);
        setTimeout(() => setNameSaved(false), 2000);
      }
    } catch { /* ignore */ }
    setSavingName(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch("/api/auth/update-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        setPasswordSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        const data = await res.json();
        setPasswordError(data.error || "Failed to update password");
      }
    } catch { /* ignore */ }
    setSavingPassword(false);
  };

  const handleDeleteAccount = async () => {
    if (confirmDelete !== "DELETE") return;
    setDeleting(true);
    try {
      await fetch("/api/auth/delete-account", { method: "DELETE" });
      await signOut({ callbackUrl: "/login" });
    } catch { /* ignore */ }
    setDeleting(false);
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

      {/* Profile */}
      <div className="rounded-3xl border bg-card/80 p-6 shadow-sm backdrop-blur-xl">
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Profile</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-2xl bg-muted/50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{user.email || "—"}</p>
              <p className="text-xs text-muted-foreground">Email</p>
            </div>
          </div>

          <div className="rounded-2xl bg-muted/50 p-4">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Full Name</label>
            <div className="flex items-center gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 rounded-xl border bg-background px-3.5 py-2 text-sm transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                placeholder="Your name"
              />
              <button
                onClick={handleSaveName}
                disabled={savingName || !name.trim() || name === user.name}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
              >
                {savingName ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : nameSaved ? <Check className="h-3.5 w-3.5" /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-3xl border bg-card/80 p-6 shadow-sm backdrop-blur-xl">
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Current Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border bg-background px-3.5 py-2.5 pl-9 text-sm transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">New Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border bg-background px-3.5 py-2.5 pl-9 pr-9 text-sm transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Confirm New Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border bg-background px-3.5 py-2.5 pl-9 text-sm transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {passwordError && (
            <p className="rounded-xl bg-red-500/10 px-3.5 py-2 text-xs text-red-500">{passwordError}</p>
          )}
          {passwordSuccess && (
            <p className="rounded-xl bg-emerald-500/10 px-3.5 py-2 text-xs text-emerald-500">Password updated successfully</p>
          )}

          <button
            type="submit"
            disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {savingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {savingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* AI Memory Settings */}
      <AIMemorySettings />

      {/* Logout */}
      <div className="rounded-3xl border bg-card/80 p-6 shadow-sm backdrop-blur-xl">
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Session</h2>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-500 transition-all hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>

      {/* Delete Account */}
      <div className="rounded-3xl border border-red-500/20 bg-card/80 p-6 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <h2 className="text-lg font-semibold tracking-tight text-red-500">Danger Zone</h2>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Once you delete your account, there is no going back. All your data will be permanently removed.
        </p>
        <div className="mt-4 space-y-2">
          <input
            value={confirmDelete}
            onChange={(e) => setConfirmDelete(e.target.value)}
            placeholder='Type "DELETE" to confirm'
            className="w-full rounded-xl border border-red-500/30 bg-background px-3.5 py-2.5 text-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
          />
          <button
            onClick={handleDeleteAccount}
            disabled={confirmDelete !== "DELETE" || deleting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-red-600 disabled:opacity-50"
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            {deleting ? "Deleting..." : "Delete My Account"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}