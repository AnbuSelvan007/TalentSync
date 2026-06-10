import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  Chat,
  Message,
} from "@/features/chat/types/chat.types";

interface ChatStore {
  chats: Chat[];
  currentChatId: string;

  createChat: () => void;

  addMessage: (
    message: Message
  ) => void;

  switchChat: (
    chatId: string
  ) => void;

  clearCurrentChat: () => void;
}

export const useChatStore =
  create<ChatStore>()(
    persist(
      (set) => {
        const initialChat: Chat = {
          id: crypto.randomUUID(),
          title: "New Chat",
          messages: [],
        };

        return {
          chats: [initialChat],

          currentChatId:
            initialChat.id,

          createChat: () => {
            const newChat: Chat = {
              id: crypto.randomUUID(),
              title: "New Chat",
              messages: [],
            };

            set((state) => ({
              chats: [
                newChat,
                ...state.chats,
              ],
              currentChatId:
                newChat.id,
            }));
          },

          switchChat: (
            chatId
          ) => {
            set({
              currentChatId:
                chatId,
            });
          },

          addMessage: (
            message
          ) => {
            set((state) => ({
              chats: state.chats.map(
                (chat) =>
                  chat.id ===
                  state.currentChatId
                    ? {
                        ...chat,
                        messages: [
                          ...chat.messages,
                          message,
                        ],
                      }
                    : chat
              ),
            }));
          },

          clearCurrentChat: () => {
            set((state) => ({
              chats: state.chats.map(
                (chat) =>
                  chat.id ===
                  state.currentChatId
                    ? {
                        ...chat,
                        messages: [],
                      }
                    : chat
              ),
            }));
          },
        };
      },
      {
        name: "talentsync-chat-v2",
      }
    )
  );