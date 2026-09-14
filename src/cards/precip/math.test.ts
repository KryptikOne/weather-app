import { describe, expect, it } from "vitest";
import { isDry, precipBars } from "./math";

const at = (amounts: number[]) => amounts.map((amount, i) => ({ time: `t${i}`, amount }));

describe("precip math", () => {
  it("detects dry hours, including an empty series", () => {
    expect(isDry(at([0, 0, 0]))).toBe(true);
    expect(isDry(at([0, 0.2, 0]))).toBe(false);
    expect(isDry([])).toBe(true);
  });
  it("scales bars to the wettest minute with a visible floor for drizzle", () => {
    const { heights, max } = precipBars(at([0, 0.05, 2]), 40);
    expect(max).toBe(2);
    expect(heights[0]).toBe(0);
    expect(heights[1]).toBe(2);        // floor
    expect(heights[2]).toBe(40);
  });
});
