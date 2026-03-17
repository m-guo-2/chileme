import { NextResponse } from "next/server";
import { getDashboardPayload } from "@/lib/mock/store";

export async function GET() {
  return NextResponse.json(getDashboardPayload());
}
