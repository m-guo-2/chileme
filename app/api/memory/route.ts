import { NextRequest, NextResponse } from "next/server";
import { getMemoryPayload, updateMemoryCard } from "@/lib/mock/store";

export async function GET() {
  return NextResponse.json(getMemoryPayload());
}

export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as { id?: string; detail?: string };

  if (!body.id || !body.detail?.trim()) {
    return NextResponse.json({ message: "id and detail are required" }, { status: 400 });
  }

  return NextResponse.json(updateMemoryCard(body.id, body.detail));
}
