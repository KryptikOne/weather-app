// @vitest-environment node
import { describe, expect, it } from "vitest";
import { safeEqual, signSession, verifySession } from "./session";

const secret = "test-secret";
const now = 1_800_000_000_000;

describe("session tokens", () => {
  it("round-trips a signed token before expiry", async () => {
    const token = await signSession(secret, now + 1000);
    expect(await verifySession(secret, token, now)).toBe(true);
  });
  it("rejects expiry, tampering, a wrong secret, and garbage", async () => {
    const token = await signSession(secret, now + 1000);
    expect(await verifySession(secret, token, now + 1001)).toBe(false);
    expect(await verifySession(secret, token.replace(/.$/, (c) => (c === "a" ? "b" : "a")), now)).toBe(false);
    expect(await verifySession("other", token, now)).toBe(false);
    expect(await verifySession(secret, undefined, now)).toBe(false);
    expect(await verifySession(secret, "nonsense", now)).toBe(false);
    expect(await verifySession(secret, `${now + 1000}.`, now)).toBe(false);
  });
  it("compares strings in constant length-safe form", () => {
    expect(safeEqual("abc", "abc")).toBe(true);
    expect(safeEqual("abc", "abd")).toBe(false);
    expect(safeEqual("abc", "ab")).toBe(false);
  });
});
