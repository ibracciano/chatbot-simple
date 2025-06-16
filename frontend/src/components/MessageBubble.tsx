import React from "react";
import type { ChatMessage } from "../types/chatbot";

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";
  const bubbleClasses = isUser
    ? "bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white self-end rounded-br-none"
    : "bg-gradient-to-r from-blue-800 to-indigo-900 text-white self-start rounded-bl-none";

  return (
    <div
      className={`max-w-[70%] p-3 rounded-xl shadow-md my-2 ${bubbleClasses}`}
    >
      <p className="whitespace-pre-wrap">{message.content}</p>
    </div>
  );
};

export default MessageBubble;
