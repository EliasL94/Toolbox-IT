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

/**
 * POST /api/v1/reviews
 *
 * Reçoit une URL GitHub, récupère l'arborescence via l'API GitHub,
 * envoie le tout à Gemini pour analyse, stocke les résultats.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const userId = (session.user as any).id;
  
  const reviews = await getAllReviews(userId);
  return NextResponse.json(reviews, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const body = await request.json();
    const { repository_url, branch = "main" } = body;

    // 1. Validation de l'URL
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

    // 2. Vérifier que Gemini est configuré
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Clé API Gemini non configurée sur le serveur." },
        { status: 503 }
      );
    }

    // 3. Vérifier si une analyse existe déjà pour ce repo et cette branche (pour écraser)
    const existingReviews = await getAllReviews(userId);
    const existingReview = existingReviews.find(
      (r) => r.repository_url === cleanUrl && r.branch === branch
    );

    const reviewId = existingReview ? existingReview.id : generateReviewId();

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

    // 4. Récupérer l'arborescence GitHub
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

      await saveReview({
        id: reviewId,
        userId,
        status: "failed",
        repository_url: cleanUrl,
        branch,
        created_at: new Date().toISOString(),
        error_message:
          errorMessages[ghResponse.status] ??
          `Erreur GitHub (code ${ghResponse.status}).`,
      });

      return NextResponse.json(
        {
          id: reviewId,
          error:
            errorMessages[ghResponse.status] ??
            `Erreur GitHub inattendue (code ${ghResponse.status}).`,
        },
        { status: ghResponse.status === 404 ? 404 : 502 }
      );
    }

    const ghData = await ghResponse.json();
    const tree: { path: string; type: string }[] = ghData.tree ?? [];

    // 5. Construire l'arborescence textuelle pour Gemini
    const treeText = tree
      .map((node: { path: string; type: string }) =>
        `${node.type === "tree" ? "📁" : "📄"} ${node.path}`
      )
      .join("\n");

    // 6. Appel Gemini pour l'analyse (avec retry + fallback automatique)
    const prompt = buildAnalysisPrompt(cleanUrl, branch, treeText);
    const rawText = await generateWithRetry(prompt);

    // 7. Parser la réponse JSON de Gemini
    let report: ReviewReport;
    try {
      // Nettoyer le texte (Gemini peut entourer le JSON de ```json ... ```)
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Pas de JSON trouvé dans la réponse Gemini.");
      }
      report = JSON.parse(jsonMatch[0]) as ReviewReport;
    } catch (parseError) {
      console.error("[Reviews] Erreur parsing Gemini:", parseError);
      console.error("[Reviews] Réponse brute:", rawText);

      await saveReview({
        id: reviewId,
        userId,
        status: "failed",
        repository_url: cleanUrl,
        branch,
        created_at: new Date().toISOString(),
        error_message:
          "L'IA n'a pas retourné un format analysable. Veuillez réessayer.",
      });

      return NextResponse.json(
        {
          id: reviewId,
          error: "Erreur de format dans la réponse de l'IA.",
        },
        { status: 502 }
      );
    }

    // 8. Sauvegarder le résultat final
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

    return NextResponse.json(
      {
        id: reviewId,
        status: "completed",
        repository_url: cleanUrl,
        links: { status_url: `/api/v1/reviews/${reviewId}` },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Reviews POST] Erreur inattendue:", error);

    // Détecter les erreurs Gemini 503 (surcharge)
    const errorMsg = (error as Error)?.message ?? "";
    if (errorMsg.includes("503") || errorMsg.includes("UNAVAILABLE") || errorMsg.includes("high demand")) {
      return NextResponse.json(
        { error: "Le service IA est temporairement surchargé. Veuillez réessayer dans quelques secondes." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Erreur interne du serveur. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
