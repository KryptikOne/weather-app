import { safeEqual, SESSION_COOKIE, SESSION_TTL_MS, signSession } from "./session";

export const MIN_PIN_LENGTH = 6;

type Env = { pin: string | undefined; secret: string | undefined };
type Options = { delayMs?: number; now?: number; secure?: boolean };

const readPin = (body: unknown): string =>
  typeof body === "object" && body !== null && typeof (body as { pin?: unknown }).pin === "string" ? (body as { pin: string }).pin : "";

export async function handleUnlock(body: unknown, env: Env, opts: Options = {}): Promise<Response> {
  const { delayMs = 1500, now = Date.now(), secure = true } = opts;
  // Any characters are allowed; a long password-manager string is the intended use.
  if (!env.pin || !env.secret || env.pin.length < MIN_PIN_LENGTH) {
    return Response.json({ error: "not configured" }, { status: 500 });
  }
  if (!safeEqual(readPin(body), env.pin)) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));   // makes guessing slow and boring
    return Response.json({ error: "wrong" }, { status: 401 });
  }
  const token = await signSession(env.secret, now + SESSION_TTL_MS);
  const cookie = [
    `${SESSION_COOKIE}=${token}`, "Path=/", "HttpOnly", "SameSite=Lax",
    `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`, ...(secure ? ["Secure"] : []),
  ].join("; ");
  return new Response(null, { status: 204, headers: { "Set-Cookie": cookie } });
}
