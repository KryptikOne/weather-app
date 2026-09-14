import { describe, expect, it } from "vitest";
import { iconFor } from "./iconFor";

describe("iconFor", () => {
  it.each([
    [800, false, "clear-day"], [800, true, "clear-night"],
    [801, false, "partly-cloudy-day"], [803, true, "overcast-night"], [804, false, "overcast"],
    [500, false, "partly-cloudy-day-rain"], [501, true, "rain"], [511, false, "sleet"],
    [300, false, "drizzle"], [600, false, "snow"], [613, false, "sleet"],
    [211, false, "thunderstorms-day"], [201, true, "thunderstorms-night-rain"],
    [741, true, "fog-night"], [701, false, "mist"], [781, false, "tornado"], [999, false, "not-available"],
  ])("code %i night=%s -> %s", (code, isNight, name) => {
    expect(iconFor({ code, isNight })).toBe(name);
  });
});
