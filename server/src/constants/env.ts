import dotenv from "dotenv";
dotenv.config();

// fonction pour obtenir les variables d'environnement
const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  // console.log(value);

  if (value === undefined) {
    throw new Error(`La variable d'environnement: ${key}, n'est pas définie`);
  }

  return value;
};

export const OPENAI_API_KEY = getEnv("OPENAI_API_KEY");
export const PORT = getEnv("PORT", "5000");
export const NODE_ENV = getEnv("NODE_ENV", "development");
export const APP_ORIGIN = getEnv("APP_ORIGIN", "http://localhost:5173");
