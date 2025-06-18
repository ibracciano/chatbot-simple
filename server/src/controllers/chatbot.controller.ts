import { Request, Response, NextFunction } from "express";
import { ChatMessage } from "../types/chatbot";
import { getChatbotResponse } from "../services/openai.service";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } from "../constants/http";

export const chatbotController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { conversationHistory } = req.body as {
    conversationHistory: ChatMessage[];
  };

  // console.log("historique", conversationHistory);

  if (!conversationHistory || !Array.isArray(conversationHistory)) {
    res.status(BAD_REQUEST).json({
      error:
        "L'historique de la conversation est requise et doit être un tableau",
    });
    return; // Fin immédiate, pas de `return res`
  }

  try {
    const response = await getChatbotResponse(conversationHistory);
    // console.log("response", response);

    if ("orderDetails" in response) {
      res.status(OK).json({
        message: response.message,
        orderDetails: response.orderDetails,
      });
    } else {
      res.status(OK).json({
        message: response,
      });
    }
  } catch (error) {
    console.error("Erreur dans le controller du chatbot:", error);
    next(error); // Passe à ton middleware global d'erreurs
  }
};
