import React, { useState } from "react";

// Types
interface Message {
  role: "assistant" | "user";
  content: string;
}

interface Product {
  name: string;
  quantity: number;
}

type HistoryItem = {
  id: string;
  conversation: Message[];
  products: Product[];
  customerName: string;
  deliveryAddress: string;
  contactInfo: string;
  status: string;
};

export interface ChatHistoryProps {
  histories: HistoryItem[];
}

// ✅ Composant principal
export const ChatHistory: React.FC<ChatHistoryProps> = ({ histories }) => {
  // console.log("history", histories);
  // const [selected, setSelected] = useState<NewFormat[] | null>(histories);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [index, setIndex] = useState<string>("");

  const handleClickHistory = (indexHistory: string) => {
    setIndex(indexHistory);
    setOpenModal(true);
  };

  return (
    <div className="w-full md:w-[30%] p-[16px] my-0 mx-auto">
      <h2 className="mb-4">Historiques des discussions</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {histories?.map((h) => (
          <li
            key={h.id}
            className="flex items-center justify-between border border-[#ddd] p-[8px] mb-[8px] rounded-md"
          >
            <strong>
              #ID :{" "}
              {Math.ceil(Math.random() * 1000000) + h.id.toLocaleUpperCase()}{" "}
            </strong>
            <button
              onClick={() => handleClickHistory(h.id)}
              className="ml-[16px] bg-gray-200 px-2 py-1 rounded-md cursor-pointer"
              // style={{ marginLeft: "1rem" }}
            >
              Voir détails
            </button>
          </li>
        ))}
      </ul>

      {openModal && (
        <div
          className="
      fixed inset-0 
      w-screen h-screen 
      bg-black/50 
      flex items-center justify-center
      
    "
          onClick={() => setOpenModal(false)}
        >
          <div
            className="
        relative 
        bg-white 
        p-8 
        max-w-[600px] w-[90%] 
        max-h-[80vh] 
        overflow-y-auto
      "
            onClick={(e) => e.stopPropagation()}
          >
            {!histories || histories.length === 0 ? (
              <p className="text-center text-gray-500">Pas d'historique</p>
            ) : (
              <>
                {histories
                  .filter((historie) => historie.id === index)
                  .map((historie) => (
                    <div key={historie.id} className="rounded-md">
                      <h3 className="mb-4">Discussion ID: {historie.id}</h3>
                      <h4 className="mb-4">Messages :</h4>
                      {historie.conversation.map((msg, i) => (
                        <div
                          key={i}
                          className={`
                    p-2 rounded-md mb-2 
                    ${
                      msg.role === "assistant"
                        ? "bg-gradient-to-r from-slate-900 to-slate-700 text-white"
                        : "bg-gradient-to-r from-blue-800 to-indigo-900 hover:bg-blue-700 text-white ml-4"
                    }
                  `}
                        >
                          <strong>{msg.role} :</strong> {msg.content}
                        </div>
                      ))}
                      <h4>Produits :</h4>
                      {historie.products.map((p, i) => (
                        <div key={i} className="mb-4 bg-gray-50 p-2 rounded-md">
                          <p>
                            <strong>Nom :</strong> {p.name}
                          </p>
                          <p>
                            <strong>Quantité :</strong> {p.quantity}
                          </p>
                          <p>
                            <strong>Client :</strong> {historie.customerName}
                          </p>
                          <p>
                            <strong>Adresse :</strong>{" "}
                            {historie.deliveryAddress}
                          </p>
                          <p>
                            <strong>Contact :</strong> {historie.contactInfo}
                          </p>
                          <p>
                            <strong>Statut :</strong> {historie.status}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
              </>
            )}

            <button
              className="
          absolute top-4 right-4 
          bg-red-600 
          rounded-full w-10 h-10 
          cursor-pointer 
          text-white 
          flex items-center justify-center
        "
              onClick={() => setOpenModal(false)}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
