import { describe, expect, it } from "vitest";
import { getMoonData, nextPrincipalPhases, phaseName } from "./moon";

const DAY = 24 * 60 * 60 * 1000;
const sameDayWithin = (d: Date, iso: string, hours = 36) =>
  Math.abs(d.getTime() - new Date(iso).getTime()) <= hours * 60 * 60 * 1000;

describe("phaseName", () => {
  it.each([
    [0, "New Moon"], [0.1, "Waxing Crescent"], [0.25, "First Quarter"], [0.4, "Waxing Gibbous"],
    [0.5, "Full Moon"], [0.6, "Waning Gibbous"], [0.75, "Last Quarter"], [0.9, "Waning Crescent"],
  ])("names phase %f as %s", (phase, name) => {
    expect(phaseName(phase)).toBe(name);
  });
});

describe("nextPrincipalPhases", () => {
  it("returns the next four phases in date order", () => {
    const next = nextPrincipalPhases(new Date("2026-09-14T04:00:00Z"));
    expect(next.map((n) => n.name)).toEqual(["First Quarter", "Full Moon", "Last Quarter", "New Moon"]);
    expect(sameDayWithin(next[0].date, "2026-09-18T12:00:00Z")).toBe(true);
    expect(sameDayWithin(next[1].date, "2026-09-26T12:00:00Z")).toBe(true);
    expect(sameDayWithin(next[2].date, "2026-10-03T12:00:00Z")).toBe(true);
    expect(sameDayWithin(next[3].date, "2026-10-10T12:00:00Z")).toBe(true);
  });

  it("never returns a date in the past", () => {
    const from = new Date("2026-09-14T04:00:00Z");
    for (const n of nextPrincipalPhases(from)) expect(n.date.getTime()).toBeGreaterThan(from.getTime() - DAY);
  });
});

describe("getMoonData", () => {
  it("reports a thin waxing crescent three days after the Sep 11 new moon", () => {
    const moon = getMoonData(new Date("2026-09-14T04:12:00Z"), 41.809, -88.011);
    expect(moon.phaseName).toBe("Waxing Crescent");
    expect(moon.illumination).toBeGreaterThan(0.05);
    expect(moon.illumination).toBeLessThan(0.18);
    expect(moon.next).toHaveLength(4);
  });
});
