/** Route API — Analyse de dépôts GitHub via Gemini */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateWithRetry } from "@/lib/gemini";
import { buildAnalysisPrompt } from "@/lib/prompts";
import {
  saveReview,
  generateReviewId,
  getAllReviews,
  type ReviewReport,
} from "@/lib/store";

/** Regex pour valider une URL GitHub */
const GITHUB_URL_REGEX =
  /^https:\/\/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+?)(?:\.git)?\/?$/;

function isAIOverloadError(msg: string) {
  return msg.includes("503") || msg.includes("UNAVAILABLE") || msg.includes("high demand");
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;
  
  const reviews = await getAllReviews(userId);
  return NextResponse.json(reviews, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const userId = (session.user as { id: string }).id;

    const body = await request.json();
    const { repository_url, branch = "main" } = body;

    if (!repository_url || typeof repository_url !== "string") {
      return NextResponse.json(
        { error: "Le champ repository_url est requis." },
        { status: 400 }
      );
    }

    const cleanUrl = repository_url.trim().replace(/\.git\/?$/, "");
    const match = GITHUB_URL_REGEX.exec(cleanUrl);

    if (!match) {
      return NextResponse.json(
        {
          error:
            "URL GitHub invalide. Format attendu : https://github.com/utilisateur/projet",
        },
        { status: 400 }
      );
    }

    const [, owner, repo] = match;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Clé API Gemini non configurée sur le serveur." },
        { status: 503 }
      );
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendMsg = (step: string, progress: number, extra: Record<string, unknown> = {}) => {
          controller.enqueue(
            encoder.encode(JSON.stringify({ step, progress, ...extra }) + "\n")
          );
        };

        let reviewId = "";
        try {
          sendMsg("Initialisation de l'analyse...", 10);
          
          const existingReviews = await getAllReviews(userId);
          const existingReview = existingReviews.find(
            (r) => r.repository_url === cleanUrl && r.branch === branch
          );

          reviewId = existingReview ? existingReview.id : generateReviewId();

          await saveReview({
            id: reviewId,
            userId,
            status: "processing",
            repository_url: cleanUrl,
            branch,
            created_at: existingReview
              ? existingReview.created_at
              : new Date().toISOString(),
          });

          sendMsg("Récupération de l'arborescence GitHub...", 25);
          const githubToken = process.env.GITHUB_TOKEN;
          const headers: Record<string, string> = {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "Toolbox-IT/1.0",
          };
          if (githubToken) {
            headers["Authorization"] = `Bearer ${githubToken}`;
          }

          const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
          const ghResponse = await fetch(apiUrl, { headers });

          if (!ghResponse.ok) {
            const errorMessages: Record<number, string> = {
              404: `Dépôt "${owner}/${repo}" introuvable ou privé. Vérifiez l'URL.`,
              403: "Accès refusé par GitHub. Token expiré ou manquant.",
              409: `Le dépôt "${owner}/${repo}" semble vide (aucun commit).`,
              429: "Limite de requêtes GitHub atteinte. Réessayez dans quelques minutes.",
            };
            const errorText = errorMessages[ghResponse.status as keyof typeof errorMessages] ?? `Erreur GitHub (code ${ghResponse.status}).`;
            
            await saveReview({
              id: reviewId,
              userId,
              status: "failed",
              repository_url: cleanUrl,
              branch,
              created_at: new Date().toISOString(),
              error_message: errorText,
            });

            sendMsg(errorText, 0, { error: errorText });
            controller.close();
            return;
          }

          sendMsg("Lecture des fichiers terminée...", 45);
          const ghData = await ghResponse.json();
          const tree: { path: string; type: string }[] = ghData.tree ?? [];

          const treeText = tree
            .map((node: { path: string; type: string }) =>
              `${node.type === "tree" ? "📁" : "📄"} ${node.path}`
            )
            .join("\n");

          sendMsg("Analyse par l'IA en cours (cela peut prendre quelques secondes)...", 60);
          const prompt = buildAnalysisPrompt(cleanUrl, branch, treeText);
          const rawText = await generateWithRetry(prompt);

          sendMsg("Génération du rapport détaillée...", 85);
          let report: ReviewReport;
          try {
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
              throw new Error("Pas de JSON trouvé dans la réponse Gemini.");
            }
            report = JSON.parse(jsonMatch[0]) as ReviewReport;
          } catch (parseError) {
            console.error("[Reviews] Erreur parsing Gemini:", parseError);
            await saveReview({
               id: reviewId, userId, status: "failed", repository_url: cleanUrl, branch, created_at: new Date().toISOString(),
               error_message: "L'IA n'a pas retourné un format analysable. Veuillez réessayer."
            });
            sendMsg("Erreur de format IA", 0, { error: "Erreur de format dans la réponse de l'IA." });
            controller.close();
            return;
          }

          sendMsg("Finalisation et sauvegarde...", 95);
          await saveReview({
            id: reviewId,
            userId,
            status: "completed",
            repository_url: cleanUrl,
            branch,
            created_at: existingReview
              ? existingReview.created_at
              : new Date().toISOString(),
            completed_at: new Date().toISOString(),
            report,
          });

          sendMsg("Terminé", 100, { id: reviewId });
          controller.close();

        } catch (error: unknown) {
          console.error("[Reviews Stream Error]:", error);
          const errorMsg = (error as Error)?.message ?? "";
          let finalError = "Erreur interne du serveur lors de l'analyse.";
          if (isAIOverloadError(errorMsg)) {
             finalError = "Le service IA est temporairement surchargé. Veuillez réessayer.";
          }
          sendMsg(finalError, 0, { error: finalError });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      },
    });

  } catch {
    return NextResponse.json(
      { error: "Erreur interne du serveur. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
