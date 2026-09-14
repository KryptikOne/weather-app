export const SESSION_COOKIE = "wx_session";
export const SESSION_TTL_MS = 365 * 24 * 60 * 60 * 1000;

const enc = new TextEncoder();
const toBase64Url = (bytes: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

/** HMAC-SHA256 through Web Crypto, so it runs in the edge proxy and in Node alike. */
async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toBase64Url(await crypto.subtle.sign("HMAC", key, enc.encode(message)));
}

/** Constant-time comparison for equal-length strings; unequal lengths fail fast, which leaks only the length. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Token shape: `<expiresAt>.<signature>`; the signature covers a version tag and the expiry. */
export async function signSession(secret: string, expiresAt: number): Promise<string> {
  return `${expiresAt}.${await hmac(secret, `v1:${expiresAt}`)}`;
}

export async function verifySession(secret: string, token: string | undefined, now = Date.now()): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot < 0) return false;
  const expiresAt = Number(token.slice(0, dot));
  if (!Number.isFinite(expiresAt) || expiresAt <= now) return false;
  const expected = await hmac(secret, `v1:${expiresAt}`);
  return safeEqual(token.slice(dot + 1), expected);
}
