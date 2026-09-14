import { describe, expect, it } from "vitest";
import { statusFor } from "./statusFor";

describe("statusFor", () => {
  it("astro-only cards are ready as soon as astronomy exists", () => {
    expect(statusFor(["astro"], { weatherStatus: "loading", hasAstro: true })).toBe("ready");
    expect(statusFor(["astro"], { weatherStatus: "ready", hasAstro: false })).toBe("loading");
  });
  it("weather and air cards follow the weather status", () => {
    expect(statusFor(["weather"], { weatherStatus: "stale", hasAstro: false })).toBe("stale");
    expect(statusFor(["air"], { weatherStatus: "error", hasAstro: true })).toBe("error");
  });
  it("cards needing both wait for astronomy", () => {
    expect(statusFor(["weather", "astro"], { weatherStatus: "ready", hasAstro: false })).toBe("loading");
    expect(statusFor(["weather", "astro"], { weatherStatus: "ready", hasAstro: true })).toBe("ready");
  });
});
