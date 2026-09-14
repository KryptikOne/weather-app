import { describe, expect, it } from "vitest";
import { formatDuration, formatHourLabel, formatShortDate, formatTime, formatWeekday } from "./time";
import { DEFAULT_UNITS, type Units } from "./units";

const t = "2026-09-13T11:31:00Z"; // 6:31 AM in Chicago, 20:31 in Tokyo
const h24: Units = { ...DEFAULT_UNITS, time: "24h" };

describe("time formatting in the location zone", () => {
  it("formats clock time in 12h and 24h", () => {
    expect(formatTime(t, "America/Chicago", DEFAULT_UNITS)).toBe("6:31 AM");
    expect(formatTime(t, "Asia/Tokyo", h24)).toBe("20:31");
  });
  it("formats hour labels", () => {
    expect(formatHourLabel(t, "America/Chicago", DEFAULT_UNITS)).toBe("6AM");
    expect(formatHourLabel(t, "Asia/Tokyo", h24)).toBe("20");
  });
  it("formats weekday and short date", () => {
    expect(formatWeekday(t, "America/Chicago")).toBe("Sun");
    expect(formatShortDate("2026-09-18T20:44:00Z", "America/Chicago")).toBe("Sep 18");
  });
  it("formats durations", () => {
    expect(formatDuration(811)).toBe("13 hrs 31 mins");
    expect(formatDuration(60)).toBe("1 hr 0 mins");
  });
});
