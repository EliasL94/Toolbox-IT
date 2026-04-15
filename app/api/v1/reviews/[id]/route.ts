import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getReview, deleteReview } from "@/lib/store";

/**
 * GET /api/v1/reviews/[id]
 *
 * Récupère le statut et le rapport d'une analyse par son ID.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { error: "ID de review invalide." },
      { status: 400 }
    );
  }

  const review = await getReview(id);

  if (!review) {
    return NextResponse.json(
      { error: `Review "${id}" introuvable.` },
      { status: 404 }
    );
  }

  return NextResponse.json(review, { status: 200 });
}

/**
 * DELETE /api/v1/reviews/[id]
 *
 * Supprime une analyse par son ID, en vérifiant les droits de l'utilisateur.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const userId = (session.user as any).id;
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { error: "ID de review invalide." },
      { status: 400 }
    );
  }

  const review = await getReview(id);
  if (!review) {
    return NextResponse.json(
      { error: `Review "${id}" introuvable.` },
      { status: 404 }
    );
  }

  if (review.userId !== userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const deleted = await deleteReview(id, userId);
  if (deleted) {
    return NextResponse.json({ message: "Analyse supprimée avec succès" }, { status: 200 });
  } else {
    return NextResponse.json({ error: "Impossible de supprimer l'analyse" }, { status: 500 });
  }
}
