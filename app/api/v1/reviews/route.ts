import { NextResponse } from "next/server";
import { createReview, validateReviewInput } from "@/app/lib/reviews-store";
import { ReviewCreateInput } from "@/app/lib/reviews-types";

export async function POST(request: Request) {
  let body: ReviewCreateInput;

  try {
    body = (await request.json()) as ReviewCreateInput;
  } catch {
    return NextResponse.json(
      { error: "Body JSON invalide." },
      { status: 400 },
    );
  }

  const validationError = validateReviewInput(body);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const review = createReview(body);

  return NextResponse.json(
    {
      id: review.id,
      status: review.status,
      repository_url: review.repository_url,
      created_at: review.created_at,
      links: {
        status_url: `/api/v1/reviews/${review.id}`,
      },
    },
    { status: 202 },
  );
}
