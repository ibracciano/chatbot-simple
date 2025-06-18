import OpenAI from "openai";
import { ChatMessage, OrderDetails } from "../types/chatbot";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Vous êtes un assistant utile pour la prise de commandes clients.
Votre objectif est d'extraire les noms de produits, les quantités, le nom du client, l'adresse de livraison et les informations de contact.
Si vous avez suffisamment d'informations pour former une commande, fournissez-les au format JSON dans la réponse.
Sinon, continuez la conversation pour recueillir plus de détails.
Si l'utilisateur souhaite discuter d'un autre sujet en dehors des commandes, dites-lui que ce n'est pas votre rôle.

Lorsqu'une commande est détectée, structurez votre JSON comme suit :
{
  "products": [{"name": "Nom du produit", "quantity": N}],
  "customerName": "Nom du client",
  "deliveryAddress": "Adresse de livraison",
  "contactInfo": "Informations de contact (téléphone ou e-mail)",
  "status": "pending"
}

Exemple de conversation pour la détection d'une commande :
Utilisateur : "Je voudrais 2 pizzas et un coca."
Assistant : "Super ! Quel type de pizzas aimeriez-vous ? Et pour la livraison, quel est votre nom et votre adresse ?"

Utilisateur : "Deux pizzas pepperoni, s'il vous plaît. Mon nom est Jean Dupont, et j'habite au 123 Rue Principale, Ville-sur-Mer. Mon téléphone est le 555-1234."
Assistant : "Merci, Jean. Donc, deux pizzas pepperoni. Y a-t-il autre chose ? Si non, je peux traiter cette commande pour :
{
  "products": [{"name": "pizza pepperoni", "quantity": 2}],
  "customerName": "Jean Dupont",
  "deliveryAddress": "123 Rue Principale, Ville-sur-Mer",
  "contactInfo": "555-1234",
  "status": "pending"
}
"
`;

export async function getChatbotResponse(
  conversationHistory: ChatMessage[]
): Promise<ChatMessage | { message: ChatMessage; orderDetails: OrderDetails }> {
  const messages = [
    { role: "system" as const, content: SYSTEM_PROMPT }, // role developpeur
    ...conversationHistory,
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const botMessageContent =
      completion.choices[0].message?.content ||
      "Désolé, Je n'ai pas pu traiter ça..";

    // Attempt to parse JSON for order details
    try {
      const jsonMatch = botMessageContent.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        const orderDetails: OrderDetails = JSON.parse(jsonMatch[1]);
        // Remove the JSON block from the message content for a cleaner display
        const cleanMessage = botMessageContent
          .replace(/```json[\s\S]*?```/, "")
          .trim();
        return {
          message: {
            role: "assistant",
            content: cleanMessage || "J'ai pris note de votre commande.",
          },
          orderDetails: orderDetails,
        };
      }
    } catch (jsonError) {
      console.warn(
        "Impossible d'analyser le JSON à partir de la réponse OpenAI, en continuant avec le message normal."
      );
    }

    return { role: "assistant", content: botMessageContent };
  } catch (error) {
    console.error("Erreur d'appel de l'API OPEN IA :", error);
    return {
      role: "assistant",
      content:
        "Désolé, je rencontre un problème technique. Veuillez réessayer plus tard.",
    };
  }
}
