import { ReviewCreateInput, ReviewEntity } from "./reviews-types";

const reviews = new Map<string, ReviewEntity>();

const BRANCH_PATTERN = /^[a-zA-Z0-9._/-]+$/;

function isValidGithubUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      url.hostname === "github.com" &&
      /^\/[^/]+\/[^/]+\/?$/.test(url.pathname)
    );
  } catch {
    return false;
  }
}

export function validateReviewInput(input: ReviewCreateInput): string | null {
  if (!input.repository_url || typeof input.repository_url !== "string") {
    return "repository_url est requis.";
  }

  if (input.repository_url.length > 2048 || !isValidGithubUrl(input.repository_url)) {
    return "repository_url doit etre une URL GitHub valide.";
  }

  if (input.branch && !BRANCH_PATTERN.test(input.branch)) {
    return "branch contient des caracteres invalides.";
  }

  return null;
}

function createId(): string {
  const random = Math.random().toString(36).slice(2, 12);
  return `rev_${random}`;
}

export function createReview(input: ReviewCreateInput): ReviewEntity {
  const id = createId();
  const now = new Date().toISOString();
  const branch = input.branch ?? "main";

  const review: ReviewEntity = {
    id,
    status: "pending",
    repository_url: input.repository_url,
    branch,
    created_at: now,
    progress: 0,
    message: "Analyse en attente de demarrage.",
  };

  reviews.set(id, review);
  return review;
}

export function getReviewById(id: string): ReviewEntity | null {
  if (!id.startsWith("rev_")) {
    return null;
  }

  const existing = reviews.get(id);

  if (!existing) {
    return null;
  }

  if (existing.status === "pending") {
    const updated: ReviewEntity = {
      ...existing,
      status: "processing",
      progress: 45,
      message: "Analyse de la structure des dossiers en cours...",
    };
    reviews.set(id, updated);
    return updated;
  }

  if (existing.status === "processing") {
    const completed: ReviewEntity = {
      ...existing,
      status: "completed",
      progress: 100,
      completed_at: new Date().toISOString(),
      report: {
        architecture: {
          score: 85,
          summary: "Architecture claire et bien structuree (modele MVC).",
          improvements: [
            "Extraire la logique metier des controleurs.",
            "Ajouter des interfaces pour reduire le couplage.",
          ],
        },
        security: {
          score: 92,
          issues_found: 0,
        },
        general_feedback:
          "Tres bon projet, pensez a centraliser les variables d'environnement.",
      },
    };
    reviews.set(id, completed);
    return completed;
  }

  return existing;
}
