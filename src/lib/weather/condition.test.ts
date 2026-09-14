import { describe, expect, it } from "vitest";
import { groupForCode, toCondition } from "./condition";

describe("groupForCode", () => {
  it.each([
    [211, "thunder"], [301, "drizzle"], [500, "rain"], [511, "rain"],
    [600, "snow"], [741, "fog"], [800, "clear"], [803, "clouds"], [900, "other"],
  ])("maps %i to %s", (code, group) => {
    expect(groupForCode(code)).toBe(group);
  });
});

describe("toCondition", () => {
  it("capitalizes the label and reads night from the icon suffix", () => {
    expect(toCondition({ id: 500, description: "light rain", icon: "10n" })).toEqual({
      code: 500, group: "rain", label: "Light rain", isNight: true,
    });
  });
});
