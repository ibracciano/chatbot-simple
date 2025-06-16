export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface OrderDetails {
  products: Array<{
    name: string;
    quantity: number;
    price?: number;
  }>;
  customerName?: string;
  deliveryAddress?: string;
  contactInfo?: string;
  totalAmount?: number;
  status: "pending" | "confirmed" | "cancelled";
}
// reponse du backend
export interface APIResponse {
  message: ChatMessage;
  orderDetails?: OrderDetails;
}
