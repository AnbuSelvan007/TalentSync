interface Message {
  role: "user" | "assistant";
  content: string;
}

export function buildConversationContext(
  messages: Message[],
  currentMessage: string
) {
  const recentMessages =
    messages.slice(-10);

  const history =
    recentMessages
      .map(
        (msg) =>
          `${msg.role}: ${msg.content}`
      )
      .join("\n");

  return `
Conversation History:

${history}

Current User Message:

${currentMessage}
`;
}