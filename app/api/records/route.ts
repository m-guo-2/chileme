import { NextRequest, NextResponse } from "next/server";
import { createRecord, getProfilePayload } from "@/lib/mock/store";
import type { MealRecordInput } from "@/lib/types/chileme";

export async function GET() {
  return NextResponse.json(getProfilePayload().history);
}

export async function POST(request: NextRequest) {
  const input = (await request.json()) as MealRecordInput;

  if (!input.text?.trim()) {
    return NextResponse.json({ message: "text is required" }, { status: 400 });
  }

  return NextResponse.json(createRecord(input));
}
