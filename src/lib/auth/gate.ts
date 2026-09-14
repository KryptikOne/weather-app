import { verifySession } from "./session";

export type GateDecision = "pass" | "unauthorized" | "redirect";

/** Paths that must work without a session: the unlock flow itself and what the home-screen install needs. */
const PUBLIC = [/^\/unlock$/, /^\/api\/unlock$/, /^\/manifest\.webmanifest$/, /^\/robots\.txt$/, /^\/icons\//, /^\/apple-icon\.png$/, /^\/favicon\.ico$/];

export const isPublicPath = (pathname: string) => PUBLIC.some((re) => re.test(pathname));

/** Fails closed: no secret means nothing but the public paths gets through. */
export async function decideGate(pathname: string, cookie: string | undefined, secret: string | undefined, now = Date.now()): Promise<GateDecision> {
  if (isPublicPath(pathname)) return "pass";
  if (secret && (await verifySession(secret, cookie, now))) return "pass";
  return pathname.startsWith("/api/") ? "unauthorized" : "redirect";
}
