import React, { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import type { APIResponse, ChatMessage, OrderDetails } from "./types/chatbot";
import axios from "axios";
import BG from "../src/assets/chat.jpg";

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000/api/v1";

  const sendMessage = async (text: string) => {
    const newUserMessage: ChatMessage = { role: "user", content: text };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(true);
    setOrderDetails(null);

    try {
      axios.defaults.withCredentials = true;
      const conversationHistory = [...messages, newUserMessage];
      const response = await axios.post<APIResponse>(`${API_BASE_URL}/chat`, {
        conversationHistory,
      });

      // console.log("response", response);

      if (response.statusText !== "OK") {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: APIResponse = response?.data;

      setMessages((prevMessages) => [...prevMessages, data.message]);

      if (data.orderDetails) {
        setOrderDetails(data.orderDetails);
      }
    } catch (error) {
      console.error("Erreur d'envoie de message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content:
            "Désolé, une erreur est survenue lors de l'envoi de votre message.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOrder = () => {
    if (orderDetails) {
      // Here you would typically send the confirmed order to another API endpoint
      // for actual processing (e.g., saving to database, sending to kitchen, etc.)
      console.log("Commande confirmé:", orderDetails);
      alert("La commande est confirmée!");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Merci! Votre commande a été confirmée.",
        },
      ]);
      setOrderDetails(null); // Clear order details after confirmation
    }
  };

  const handleCancelOrder = () => {
    if (orderDetails) {
      console.log("Commande échouée:", orderDetails);
      alert("Votre commande a échouée.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "La commande a été annulée. N'hésitez pas si vous avez d'autres questions.",
        },
      ]);
      setOrderDetails(null); // Clear order details after cancellation
    }
  };

  useEffect(() => {
    // Initial welcome message from the bot
    setMessages([
      {
        role: "assistant",
        content:
          "Bonjour! Comment puis-je vous aider avec votre commande aujourd'hui?",
      },
    ]);
  }, []);

  return (
    <div
      className="flex flex-col h-screen bg-gray-100 items-center justify-center p-4"
      style={{
        backgroundImage: `url(${BG})`,
        backgroundRepeat: "none",
        backgroundSize: "cover",
      }}
    >
      <div className="w-full max-w-2xl h-[90vh] bg-gradient-to-r from-slate-900 to-slate-700 rounded-lg shadow-xl flex flex-col">
        <header className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-4 rounded-t-lg">
          <h1 className="text-2xl font-bold text-center">
            Commandez en toute tranquilité
          </h1>
        </header>
        <ChatWindow
          messages={messages}
          orderDetails={orderDetails}
          onConfirmOrder={handleConfirmOrder}
          onCancelOrder={handleCancelOrder}
          isLoading={isLoading}
        />
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;
