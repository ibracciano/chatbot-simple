import React, { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import type { ChatMessage, OrderDetails } from "../types/chatbot";

interface ChatWindowProps {
  messages: ChatMessage[];
  orderDetails: OrderDetails | null;
  onConfirmOrder: () => void;
  onCancelOrder: () => void;
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  orderDetails,
  onConfirmOrder,
  onCancelOrder,
  isLoading,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, orderDetails]); // Scroll when messages or orderDetails change

  return (
    <div className="flex flex-col h-full bg-gradient-to-r from-slate-900 to-slate-700 rounded-lg shadow-lg overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto flex flex-col scrollbar-hide">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="self-start p-3 my-2 rounded-xl bg-black text-white shadow-md animate-pulse">
            <p>Veuillez patientez...</p>
          </div>
        )}

        {orderDetails && (
          <div className="self-end max-w-[80%] bg-green-100 border border-green-400 text-green-800 p-4 rounded-lg my-4 shadow-lg">
            <h3 className="font-bold text-lg mb-2">Détail de la commande:</h3>
            <ul className="list-disc pl-5 mb-3">
              {orderDetails.products.map((item, index) => (
                <li key={index}>
                  {item.quantity} x {item.name}
                </li>
              ))}
            </ul>
            {orderDetails.customerName && (
              <p>
                <strong>Client:</strong> {orderDetails.customerName}
              </p>
            )}
            {orderDetails.deliveryAddress && (
              <p>
                <strong>Addresse:</strong> {orderDetails.deliveryAddress}
              </p>
            )}
            {orderDetails.contactInfo && (
              <p>
                <strong>Contact:</strong> {orderDetails.contactInfo}
              </p>
            )}
            <p className="mt-2 text-sm text-gray-600">
              Status:{" "}
              {orderDetails.status === "pending"
                ? "EN_COURS"
                : orderDetails.status === "cancelled"
                ? "ECHEC"
                : "CONFIRME"}
            </p>

            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={onConfirmOrder}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Je confirme
              </button>
              <button
                onClick={onCancelOrder}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Je refuse
              </button>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
