import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      service: "toolbox-it",
      status: "ok",
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  );
}
