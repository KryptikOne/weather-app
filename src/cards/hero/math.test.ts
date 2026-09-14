import { describe, expect, it } from "vitest";
import { starField } from "./math";

describe("starField", () => {
  it("is deterministic for a seed and stays inside the box", () => {
    const a = starField(40, 7);
    const b = starField(40, 7);
    expect(a).toEqual(b);
    expect(a).toHaveLength(40);
    for (const s of a) {
      expect(s.x).toBeGreaterThanOrEqual(0); expect(s.x).toBeLessThanOrEqual(100);
      expect(s.y).toBeGreaterThanOrEqual(0); expect(s.y).toBeLessThanOrEqual(100);
      expect(s.r).toBeGreaterThan(0); expect(s.o).toBeGreaterThan(0); expect(s.o).toBeLessThanOrEqual(1);
    }
  });
  it("differs across seeds", () => {
    expect(starField(10, 1)).not.toEqual(starField(10, 2));
  });
});
