// src/app.ts
import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import { OK } from "./constants/http";
import chatRouter from "./routes/chatbot.route";

// Charger les variables d'environnement
dotenv.config();

// les importations

// import chatRouter from "./routes/chat.route";

const app: Application = express();

// Middlewares

app.use(express.json()); // Permet à Express de parser le JSON des requêtes
app.use(express.urlencoded({ extended: true })); // Permet de parser les données encodées par URL
app.use(morgan("common"));
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: "Trop de requêtes entrantes, attendre dans 15 minutes",
  })
);
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);

// Routes
app.use("/api/v1", chatRouter);

// Route de test
app.get("/", (_req: Request, res: Response, next: NextFunction) => {
  try {
    // throw new Error("Il y a erreur");
    res.status(OK).json({ message: "Bienvenue sur mon application" });
  } catch (error) {
    console.log("error", error);
  }
});

// Middlewares de gestion d'erreurs (doivent être après toutes les routes)
// app.use(errorHandler);
const ENV_PORT = PORT || 5000;

app.listen(ENV_PORT, async () => {
  // Connecter à la base de données
  //   connectDB();
  console.log(`Serveur demarre en mode ${NODE_ENV} au port ${ENV_PORT}`);
});
