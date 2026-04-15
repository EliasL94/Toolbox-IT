import { NextResponse } from "next/server";
import { getReviewById } from "@/app/lib/reviews-store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const params = await context.params;
  const id = params.id;

  if (!id || !id.startsWith("rev_")) {
    return NextResponse.json({ error: "Format d'ID invalide." }, { status: 400 });
  }

  const review = getReviewById(id);

  if (!review) {
    return NextResponse.json({ error: "Review introuvable." }, { status: 404 });
  }

  if (review.status === "completed") {
    return NextResponse.json(
      {
        id: review.id,
        status: review.status,
        repository_url: review.repository_url,
        completed_at: review.completed_at,
        report: review.report,
      },
      { status: 200 },
    );
  }

  if (review.status === "failed") {
    return NextResponse.json(
      {
        id: review.id,
        status: review.status,
        error_message: review.error_message,
      },
      { status: 503 },
    );
  }

  return NextResponse.json(
    {
      id: review.id,
      status: review.status,
      progress: review.progress ?? 0,
      message: review.message ?? "Analyse en cours...",
    },
    { status: 200 },
  );
}
