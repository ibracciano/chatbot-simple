/* eslint-disable @typescript-eslint/no-explicit-any */
type Message = {
  role: string;
  content: string;
};

export type OldFormat = {
  [key: string]: any; // clé numérique ou autre
  id: string;
  products: { name: string; quantity: number }[];
  customerName: string;
  deliveryAddress: string;
  contactInfo: string;
  status: string;
};

export type NewFormat = {
  id: string;
  products: { name: string; quantity: number }[];
  conversation: Message[];
  customerName: string;
  deliveryAddress: string;
  contactInfo: string;
  status: string;
};

export function transformOrder(oldOrder: OldFormat): NewFormat {
  const conversation: Message[] = [];

  // Extraire les clés numériques et les trier pour garder l'ordre
  const messageKeys = Object.keys(oldOrder)
    .filter((key) => /^\d+$/.test(key))
    .sort((a, b) => Number(a) - Number(b));

  for (const key of messageKeys) {
    conversation.push({
      role: oldOrder[key].role,
      content: oldOrder[key].content,
    });
  }

  return {
    id: oldOrder.id,
    products: oldOrder.products,
    conversation,
    customerName: oldOrder.customerName,
    deliveryAddress: oldOrder.deliveryAddress,
    contactInfo: oldOrder.contactInfo,
    status: oldOrder.status,
  };
}
