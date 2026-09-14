import { describe, expect, it } from "vitest";
import { ARC, arcPath, arcPoint, sunProgress } from "./math";

const sunrise = new Date("2026-09-13T11:31:00Z");
const sunset = new Date("2026-09-14T00:07:00Z");
const mid = new Date((sunrise.getTime() + sunset.getTime()) / 2);

describe("sunProgress", () => {
  it("runs from 0 at sunrise to 1 at sunset and clamps outside", () => {
    expect(sunProgress(sunrise, sunrise, sunset)).toBe(0);
    expect(sunProgress(mid, sunrise, sunset)).toBeCloseTo(0.5, 5);
    expect(sunProgress(sunset, sunrise, sunset)).toBe(1);
    expect(sunProgress(new Date("2026-09-13T05:00:00Z"), sunrise, sunset)).toBe(0);
    expect(sunProgress(new Date("2026-09-14T04:00:00Z"), sunrise, sunset)).toBe(1);
  });
});

describe("arc geometry", () => {
  it("places the ends on the horizon and the middle at the top", () => {
    expect(arcPoint(0, ARC.cx, ARC.cy, ARC.r)).toEqual({ x: 20, y: 160 });
    expect(arcPoint(1, ARC.cx, ARC.cy, ARC.r).x).toBeCloseTo(300, 5);
    expect(arcPoint(0.5, ARC.cx, ARC.cy, ARC.r).y).toBeCloseTo(20, 5);
  });
  it("draws a half circle left to right over the top", () => {
    expect(arcPath(160, 160, 140)).toBe("M 20 160 A 140 140 0 0 1 300 160");
  });
});
