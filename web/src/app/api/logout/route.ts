import { NextResponse } from "next/server";

import { invalidateSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ success: true });
  await invalidateSession(response);
  return response;
}
