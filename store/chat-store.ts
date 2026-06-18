import { create } from "zustand";

import {
  Chat,
  Message,
} from "@/features/chat/types/chat.types";

interface ChatStore {
  chats: Chat[];
  currentChatId: string | null;
  userId: string | null;
  isHydrated: boolean;
  isLoading: boolean;

  setUserId: (userId: string | null) => void;
  loadChats: () => Promise<void>;
  createChat: () => Promise<string | null>;
  deleteChat: (chatId: string) => Promise<void>;
  updateChatTitle: (chatId: string, title: string) => Promise<void>;
  addMessage: (message: Message) => void;
  switchChat: (chatId: string) => void;
  clearCurrentChat: () => void;
  reset: () => void;
}

const initialState = {
  chats: [] as Chat[],
  currentChatId: null as string | null,
  userId: null as string | null,
  isHydrated: false,
  isLoading: false,
};

export const useChatStore = create<ChatStore>()((set, get) => ({
  ...initialState,

  setUserId: (userId) => {
    const currentUserId = get().userId;
    if (currentUserId === userId) {
      return;
    }

    set({
      ...initialState,
      userId,
    });
  },

  reset: () => {
    set(initialState);
  },

  loadChats: async () => {
    const { userId } = get();
    if (!userId) {
      return;
    }

    set({ isLoading: true });

    try {
      const res = await fetch("/api/chat");
      if (!res.ok) {
        throw new Error("Failed to load chats");
      }

      const data = await res.json();
      const chats = (data.chats ?? []) as Chat[];

      if (chats.length === 0) {
        const createRes = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "New Chat" }),
        });

        if (!createRes.ok) {
          throw new Error("Failed to create initial chat");
        }

        const createData = await createRes.json();
        const newChat = createData.chat as Chat;

        set({
          chats: [newChat],
          currentChatId: newChat.id,
          isHydrated: true,
          isLoading: false,
        });
        return;
      }

      set({
        chats,
        currentChatId: get().currentChatId ?? chats[0]?.id ?? null,
        isHydrated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("[ChatStore] Failed to load chats:", error);
      set({ isLoading: false, isHydrated: true });
    }
  },

  createChat: async () => {
    const { userId } = get();
    if (!userId) {
      return null;
    }

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Chat" }),
    });

    if (!res.ok) {
      throw new Error("Failed to create chat");
    }

    const data = await res.json();
    const newChat = data.chat as Chat;

    set((state) => ({
      chats: [newChat, ...state.chats],
      currentChatId: newChat.id,
    }));

    return newChat.id;
  },

  switchChat: (chatId) => {
    set({ currentChatId: chatId });
  },

  addMessage: (message) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === state.currentChatId
          ? {
              ...chat,
              messages: [...chat.messages, message],
            }
          : chat
      ),
    }));
  },

  deleteChat: async (chatId: string) => {
    const res = await fetch(`/api/chat?chatId=${chatId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete chat");
    }

    set((state) => {
      const filtered = state.chats.filter((chat) => chat.id !== chatId);
      const nextCurrentId =
        state.currentChatId === chatId
          ? filtered[0]?.id ?? null
          : state.currentChatId;

      return { chats: filtered, currentChatId: nextCurrentId };
    });
  },

  updateChatTitle: async (chatId: string, title: string) => {
    const res = await fetch("/api/chat", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, title }),
    });

    if (!res.ok) {
      throw new Error("Failed to update chat title");
    }

    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId ? { ...chat, title } : chat
      ),
    }));
  },

  clearCurrentChat: () => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === state.currentChatId
          ? {
              ...chat,
              messages: [],
            }
          : chat
      ),
    }));
  },
}));
