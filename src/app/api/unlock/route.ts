import type { NextRequest } from "next/server";
import { handleUnlock } from "@/lib/auth/unlock";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  return handleUnlock(body, { pin: process.env.APP_PIN, secret: process.env.APP_SESSION_SECRET }, {
    secure: req.nextUrl.protocol === "https:",
  });
}
