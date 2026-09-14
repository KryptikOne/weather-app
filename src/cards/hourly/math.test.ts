import { describe, expect, it } from "vitest";
import { DEFAULT_UNITS } from "@/lib/format/units";
import { snapshotFixture } from "@/test/fixtures";
import { barLayout, curveLayout, formatStripValue, hourlySeries, isBarMetric } from "./math";

const box = { width: 560, height: 96, top: 18, bottom: 14 };

describe("hourlySeries", () => {
  it("maps the requested metric for the requested count", () => {
    const s = hourlySeries(snapshotFixture().hourly, "temp", 12);
    expect(s).toHaveLength(12);
    expect(typeof s[0].value).toBe("number");
    expect(s[0].condition.label.length).toBeGreaterThan(0);
  });
  it("yields null for metrics with no hourly accessor", () => {
    expect(hourlySeries(snapshotFixture().hourly, "pressure", 3).every((p) => p.value === null)).toBe(true);
  });
});

describe("curveLayout", () => {
  it("returns one point per value and a path that starts with M", () => {
    const { path, points } = curveLayout([10, 12, 11, 15, 14], box);
    expect(points).toHaveLength(5);
    expect(path.startsWith("M")).toBe(true);
    expect(points[3].y).toBeLessThan(points[0].y!);   // higher value sits higher on screen
    expect(points[0].x).toBeCloseTo(56, 5);           // centered in the first 112px column
  });
  it("skips null values in the path and marks them in points", () => {
    const { points } = curveLayout([10, null, 12], box);
    expect(points[1].y).toBeNull();
  });
  it("handles a flat series without dividing by zero", () => {
    const { points } = curveLayout([20, 20, 20], box);
    expect(points.every((p) => Number.isFinite(p.y!))).toBe(true);
  });
});

describe("barLayout", () => {
  it("scales chance against 1 and amounts against the max", () => {
    const chance = barLayout([0, 0.5, 1], box, 1);
    expect(chance[2].h).toBeCloseTo(box.height - box.top - box.bottom, 5);
    expect(chance[1].h).toBeCloseTo(chance[2].h / 2, 5);
    const amount = barLayout([0, 2, 4], box);
    expect(amount[2].h).toBeCloseTo(chance[2].h, 5);
    expect(amount[0].h).toBe(0);
  });
});

describe("helpers", () => {
  it("knows which metrics are bars", () => {
    expect(isBarMetric("precipChance")).toBe(true);
    expect(isBarMetric("temp")).toBe(false);
  });
  it("formats strip values compactly", () => {
    expect(formatStripValue("temp", 22.2, DEFAULT_UNITS)).toBe("72°");
    expect(formatStripValue("precipChance", 0.4, DEFAULT_UNITS)).toBe("40%");
    expect(formatStripValue("windSpeed", 10, DEFAULT_UNITS)).toBe("22");
    expect(formatStripValue("precipAmount", 1.25, DEFAULT_UNITS)).toBe("1.3");
    expect(formatStripValue("temp", null, DEFAULT_UNITS)).toBe("");
  });
});
