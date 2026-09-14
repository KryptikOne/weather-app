import { describe, expect, it } from "vitest";
import { snapshotFixture } from "@/test/fixtures";
import { dailyScale, markerPosition, rangeBar } from "./math";

describe("daily scale and bars", () => {
  const days = snapshotFixture().daily;
  const scale = dailyScale(days);

  it("spans the coldest low to the hottest high", () => {
    expect(days.every((d) => d.tempMin >= scale.min && d.tempMax <= scale.max)).toBe(true);
    expect(scale.max).toBeGreaterThan(scale.min);
  });

  it("puts the coldest day's bar at 0 and the hottest day's bar at 100", () => {
    const coldest = days.reduce((a, b) => (b.tempMin < a.tempMin ? b : a));
    const hottest = days.reduce((a, b) => (b.tempMax > a.tempMax ? b : a));
    expect(rangeBar(coldest, scale).left).toBeCloseTo(0, 5);
    const hot = rangeBar(hottest, scale);
    expect(hot.left + hot.width).toBeCloseTo(100, 5);
  });

  it("clamps the marker inside the track and never draws a zero-width bar", () => {
    expect(markerPosition(scale.min - 50, scale)).toBe(0);
    expect(markerPosition(scale.max + 50, scale)).toBe(100);
    const flat = { ...days[0], tempMin: 20, tempMax: 20 };
    expect(rangeBar(flat, { min: 0, max: 40 }).width).toBeGreaterThan(0);
  });

  it("widens a degenerate scale so nothing divides by zero", () => {
    const s = dailyScale([{ ...days[0], tempMin: 15, tempMax: 15 }]);
    expect(s.max).toBeGreaterThan(s.min);
  });
});
