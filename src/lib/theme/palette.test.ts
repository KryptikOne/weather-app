import { describe, expect, it } from "vitest";
import { dayPhase, palette } from "./palette";

const sun = {
  dawn: new Date("2026-09-13T11:00:00Z"),
  sunrise: new Date("2026-09-13T11:31:00Z"),
  sunset: new Date("2026-09-14T00:07:00Z"),
  dusk: new Date("2026-09-14T00:38:00Z"),
};

describe("dayPhase", () => {
  it.each([
    ["2026-09-13T10:00:00Z", "night"],
    ["2026-09-13T11:45:00Z", "dawn"],
    ["2026-09-13T17:00:00Z", "day"],
    ["2026-09-13T23:30:00Z", "dusk"],
    ["2026-09-14T01:00:00Z", "night"],
  ])("%s is %s", (iso, phase) => {
    expect(dayPhase(new Date(iso), sun)).toBe(phase);
  });
});

describe("palette", () => {
  it("returns the base palette for clear skies", () => {
    expect(palette("day", "clear").skyTop).toBe("#2f7ed8");
  });
  it("mutes the sky for rain and keeps a usable accent", () => {
    const p = palette("day", "rain");
    expect(p.skyTop).not.toBe("#2f7ed8");
    expect(p.accent).toMatch(/^#|^rgb/);
  });
});
