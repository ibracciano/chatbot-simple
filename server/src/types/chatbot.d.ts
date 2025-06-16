export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface OrderDetails {
  products: Array<{
    name: string;
    quantity: number;
    price?: number; // Optional, can be looked up later
  }>;
  customerName?: string;
  deliveryAddress?: string;
  contactInfo?: string;
  totalAmount?: number; // Calculated later
  status: "pending" | "confirmed" | "cancelled";
}

export interface ChatbotResponse {
  message: ChatMessage;
  orderDetails?: OrderDetails; // Present if an order is detected
}
