import { NextResponse } from "next/server";
import { getProfilePayload } from "@/lib/mock/store";

export async function GET() {
  return NextResponse.json(getProfilePayload());
}
