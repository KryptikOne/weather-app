// @vitest-environment node
import { describe, expect, it } from "vitest";
import { SESSION_COOKIE, verifySession } from "./session";
import { handleUnlock } from "./unlock";

const env = { pin: "12345678901234567890", secret: "s" };
const now = 1_800_000_000_000;
const fast = { delayMs: 0, now };

describe("handleUnlock", () => {
  it("refuses to run without a passcode of at least six characters and a secret", async () => {
    expect((await handleUnlock({ pin: "1" }, { pin: undefined, secret: "s" }, fast)).status).toBe(500);
    expect((await handleUnlock({ pin: "1" }, { pin: "12345", secret: "s" }, fast)).status).toBe(500);
    expect((await handleUnlock({ pin: "1" }, { pin: env.pin, secret: undefined }, fast)).status).toBe(500);
  });

  it("rejects a wrong or missing PIN with a generic error", async () => {
    expect((await handleUnlock({ pin: "00000000" }, env, fast)).status).toBe(401);
    expect((await handleUnlock({}, env, fast)).status).toBe(401);
    expect((await handleUnlock("junk", env, fast)).status).toBe(401);
    expect(await (await handleUnlock({ pin: "0" }, env, fast)).text()).toBe(JSON.stringify({ error: "wrong" }));
  });

  it("sets a year-long signed HttpOnly cookie on success", async () => {
    const res = await handleUnlock({ pin: env.pin }, env, { ...fast, secure: true });
    expect(res.status).toBe(204);
    const cookie = res.headers.get("set-cookie") ?? "";
    expect(cookie).toMatch(new RegExp(`^${SESSION_COOKIE}=`));
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Max-Age=31536000");
    const token = cookie.split(";")[0].split("=")[1];
    expect(await verifySession(env.secret, token, now + 1000)).toBe(true);
    expect(await verifySession(env.secret, token, now + 31_536_000_001)).toBe(false);
  });

  it("accepts any characters in the passcode", async () => {
    const alnum = { pin: "Xk9-qL2$vB7!mN4", secret: "s" };
    expect((await handleUnlock({ pin: alnum.pin }, alnum, fast)).status).toBe(204);
    expect((await handleUnlock({ pin: alnum.pin.toLowerCase() }, alnum, fast)).status).toBe(401);
  });

  it("omits Secure for local http", async () => {
    const res = await handleUnlock({ pin: env.pin }, env, { ...fast, secure: false });
    expect(res.headers.get("set-cookie")).not.toContain("Secure");
  });
});
