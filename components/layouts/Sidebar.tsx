"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

import { navigation } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/chat-store";
import RecentChats from "@/features/chat/components/RecentChats";

export default function Sidebar() {
  const pathname = usePathname();
  const createChat =
  useChatStore(
    (state) => state.createChat
  );
  return (
    <aside className="hidden md:flex w-72 flex-col border-r bg-background/50 backdrop-blur-xl">
      
      <div className="border-b p-6">
        <h1 className="text-2xl font-bold">
          ✨ TalentSync AI
        </h1>

        <p className="text-xs uppercase tracking-wider text-center">
          Placement Assistant
        </p>

        <Button
  className="
  w-full
  mt-5
  rounded-2xl
  h-12
  shadow-lg
"
 onClick={() => {
  if (
    window.confirm(
      "Start a new chat?"
    )
  ) {
    createChat();
  }
}}
>
          <Plus />
          New Chat
        </Button>
        <RecentChats />
      </div>

      <div className="p-4 flex-1">
        <p className="text-xs uppercase text-muted-foreground mb-4">
          Navigation
        </p>

        <div className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <Icon size={18} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}