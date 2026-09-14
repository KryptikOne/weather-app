// @vitest-environment node
import { describe, expect, it } from "vitest";
import { decideGate, isPublicPath } from "./gate";
import { signSession } from "./session";

const secret = "s";
const now = 1_800_000_000_000;

describe("gate", () => {
  it("leaves the unlock flow, manifest, icons, and robots open", () => {
    for (const p of ["/unlock", "/api/unlock", "/manifest.webmanifest", "/robots.txt", "/icons/weather/rain.svg", "/apple-icon.png", "/favicon.ico"]) {
      expect(isPublicPath(p), p).toBe(true);
    }
    expect(isPublicPath("/")).toBe(false);
    expect(isPublicPath("/api/weather")).toBe(false);
  });

  it("passes a valid session and blocks everything else", async () => {
    const good = await signSession(secret, now + 1000);
    expect(await decideGate("/", good, secret, now)).toBe("pass");
    expect(await decideGate("/api/weather?lat=1&lon=2", good, secret, now)).toBe("pass");
    expect(await decideGate("/", undefined, secret, now)).toBe("redirect");
    expect(await decideGate("/api/weather", undefined, secret, now)).toBe("unauthorized");
    expect(await decideGate("/api/geocode", "bad", secret, now)).toBe("unauthorized");
  });

  it("fails closed when the secret is missing", async () => {
    const good = await signSession(secret, now + 1000);
    expect(await decideGate("/", good, undefined, now)).toBe("redirect");
    expect(await decideGate("/unlock", undefined, undefined, now)).toBe("pass");
  });
});
