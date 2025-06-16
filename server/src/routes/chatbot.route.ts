import express from "express";
import { chatbotController } from "../controllers/chatbot.controller";

const chatRouter = express.Router();

chatRouter.post("/chat", chatbotController);

export default chatRouter;
