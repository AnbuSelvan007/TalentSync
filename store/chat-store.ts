import { create } from "zustand";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatStore {
  messages: Message[];

  setMessages: (
    messages: Message[]
  ) => void;

  clearChat: () => void;
}

export const useChatStore =
  create<ChatStore>((set) => ({
    messages: [],

    setMessages: (messages) =>
      set({ messages }),

    clearChat: () =>
      set({
        messages: [],
      }),
  }));