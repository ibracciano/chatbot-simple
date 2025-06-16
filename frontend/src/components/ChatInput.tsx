import React, { useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    // console.log("message : ", message);
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex p-4 border-t border-gray-200 bg-gradient-to-r from-slate-900 to-slate-700"
    >
      <input
        type="text"
        className="flex-1 p-3 border text-white placeholder:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Entrez votre message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isLoading}
      />
      <button
        type="submit"
        className={`ml-3 px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-200 ${
          isLoading
            ? "bg-gradient-to-r from-blue-800 to-indigo-700 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-800 to-indigo-900 hover:bg-blue-700"
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Envoie..." : "Envoyez"}
      </button>
    </form>
  );
};

export default ChatInput;
