import { NextResponse, type NextRequest } from "next/server";
import { decideGate } from "@/lib/auth/gate";
import { SESSION_COOKIE } from "@/lib/auth/session";

/** Runs before every page and API request: no valid session cookie, no weather. */
export async function proxy(req: NextRequest) {
  const decision = await decideGate(req.nextUrl.pathname, req.cookies.get(SESSION_COOKIE)?.value, process.env.APP_SESSION_SECRET);
  if (decision === "pass") return NextResponse.next();
  if (decision === "unauthorized") return NextResponse.json({ error: "locked" }, { status: 401 });
  const url = req.nextUrl.clone();
  url.pathname = "/unlock";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
