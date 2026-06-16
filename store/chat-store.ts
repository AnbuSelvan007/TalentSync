import { create } from "zustand";
import { Chat, Message } from "@/features/chat/types/chat.types";

interface ChatStore {
  chats: Chat[];
  currentChatId: string | null;
  isLoading: boolean;

  setChats: (chats: Chat[]) => void;
  setCurrentChat: (chat: Chat) => void;
  setLoading: (loading: boolean) => void;

  addMessage: (message: Message) => void;
  updateChatTitle: (chatId: string, title: string) => void;

  createChat: (chat: Chat) => void;
  removeChat: (chatId: string) => void;
  switchChat: (chatId: string) => void;
  clearCurrentChat: () => void;
}

export const useChatStore = create<ChatStore>()((set) => ({
  chats: [],
  currentChatId: null,
  isLoading: false,

  setChats: (chats) =>
    set((state) => ({
      chats,
      currentChatId: state.currentChatId ?? chats[0]?.id ?? null,
    })),

  setCurrentChat: (chat) =>
    set((state) => ({
      chats: state.chats.map((c) => (c.id === chat.id ? chat : c)),
      currentChatId: chat.id,
    })),

  setLoading: (isLoading) => set({ isLoading }),

  createChat: (chat) =>
    set((state) => ({
      chats: [chat, ...state.chats],
      currentChatId: chat.id,
    })),

  removeChat: (chatId) =>
    set((state) => {
      const filtered = state.chats.filter((c) => c.id !== chatId);
      return {
        chats: filtered,
        currentChatId:
          state.currentChatId === chatId
            ? filtered[0]?.id ?? null
            : state.currentChatId,
      };
    }),

  switchChat: (chatId) => set({ currentChatId: chatId }),

  updateChatTitle: (chatId, title) =>
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === chatId ? { ...c, title } : c
      ),
    })),

  addMessage: (message) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === state.currentChatId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      ),
    })),

  clearCurrentChat: () =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === state.currentChatId
          ? { ...chat, messages: [] }
          : chat
      ),
    })),
}));