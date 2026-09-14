import { describe, expect, it } from "vitest";
import { DEFAULT_UNITS } from "@/lib/format/units";
import { snapshotFixture } from "@/test/fixtures";
import { currentChips } from "./math";

describe("currentChips", () => {
  it("builds labeled chips in the requested order and skips unknown keys", () => {
    const { current } = snapshotFixture();
    const chips = currentChips(current, ["humidity", "bogus", "windSpeed"], DEFAULT_UNITS);
    expect(chips.map((c) => c.key)).toEqual(["humidity", "windSpeed"]);
    expect(chips[0].label).toBe("Humidity");
    expect(chips[0].value).toMatch(/^\d+%$/);
    expect(chips[1].value).toMatch(/mph$/);
  });
});
