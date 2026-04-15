import { GoogleGenAI } from "@google/genai";

/**
 * Client Gemini — initialisé avec la clé API depuis les variables d'environnement.
 * Utilisé côté serveur uniquement (API Routes / Server Actions).
 * La clé n'est jamais exposée au client.
 */

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    "[Gemini] ⚠️  GEMINI_API_KEY manquante dans .env.local. L'analyse IA ne fonctionnera pas."
  );
}

export const ai = new GoogleGenAI({ apiKey: apiKey ?? "" });

/** Modèle principal */
export const GEMINI_MODEL = "gemini-2.5-flash";

/** Modèle de fallback en cas de surcharge */
export const GEMINI_FALLBACK_MODEL = "gemini-2.5-flash-lite";

/**
 * Appel Gemini avec retry automatique et fallback.
 * - 2 tentatives sur le modèle principal
 * - 1 tentative sur le modèle de fallback
 * - Backoff exponentiel entre les tentatives
 */
export async function generateWithRetry(
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  const models = [GEMINI_MODEL, GEMINI_MODEL, GEMINI_FALLBACK_MODEL];
  let lastError: Error | null = null;

  for (let i = 0; i < models.length; i++) {
    try {
      const response = await ai.models.generateContent({
        model: models[i],
        contents: prompt,
        ...(systemInstruction && {
          config: { systemInstruction },
        }),
      });
      return response.text ?? "";
    } catch (error) {
      lastError = error as Error;
      console.warn(
        `[Gemini] Tentative ${i + 1}/${models.length} échouée (${models[i]}):`,
        (error as Error).message?.slice(0, 100)
      );

      // Attendre avant de réessayer (backoff exponentiel)
      if (i < models.length - 1) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError ?? new Error("Échec de l'appel Gemini après toutes les tentatives.");
}
