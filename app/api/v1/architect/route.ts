import { NextRequest } from "next/server";
import { ai, GEMINI_MODEL } from "@/lib/gemini";
import { ARCHITECT_SYSTEM_PROMPT } from "@/lib/prompts";
import { getReview } from "@/lib/store";

/**
 * POST /api/v1/architect
 *
 * Chat interactif avec l'IA Architecte.
 * Streaming de la réponse pour une expérience temps réel.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, reviewId } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Le champ messages est requis." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "Clé API Gemini non configurée sur le serveur.",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    // Construire l'historique de conversation pour Gemini
    const contents = messages.map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })
    );

    // Ajuster le system prompt avec le contexte de l'analyse si fourni
    let systemInstruction = ARCHITECT_SYSTEM_PROMPT;
    if (reviewId) {
      const review = await getReview(reviewId);
      if (review && review.report) {
        systemInstruction += `\n\n--- CONTEXTE PROJET ---\nL'utilisateur a récemment analysé le dépôt GitHub suivant : ${review.repository_url} (Branche: ${review.branch}).\nVoici le dernier rapport d'analyse de Toolbox-IT à prendre en compte pour te donner du contexte :\n${JSON.stringify(review.report, null, 2)}`;
      }
    }

    // Appel Gemini avec streaming
    const response = await ai.models.generateContentStream({
      model: GEMINI_MODEL,
      config: {
        systemInstruction,
      },
      contents,
    });

    // Créer un ReadableStream pour le streaming vers le client
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.text ?? "";
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          console.error("[Architect] Erreur streaming:", err);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Erreur lors de la génération." })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[Architect POST] Erreur inattendue:", error);
    return new Response(
      JSON.stringify({ error: "Erreur interne du serveur." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
