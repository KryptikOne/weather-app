import { describe, expect, it } from "vitest";
import { aqiBand, COMPONENT_LABELS } from "./math";

describe("aqiBand", () => {
  it.each([
    [1, "Good"], [2, "Fair"], [3, "Moderate"], [4, "Poor"], [5, "Very Poor"],
  ] as const)("maps %i to %s", (aqi, label) => {
    expect(aqiBand(aqi).label).toBe(label);
    expect(aqiBand(aqi).color).toMatch(/^#/);
  });
  it("labels every component", () => {
    expect(COMPONENT_LABELS.pm2_5).toBe("PM2.5");
    expect(Object.keys(COMPONENT_LABELS)).toHaveLength(8);
  });
});
