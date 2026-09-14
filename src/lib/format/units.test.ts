import { describe, expect, it } from "vitest";
import { formatMetric } from "@/lib/metrics";
import { DEFAULT_UNITS, formatDistance, formatPressure, formatSpeed, formatTemp, type Units } from "./units";

const metric: Units = { temp: "C", speed: "kmh", pressure: "hPa", distance: "km", time: "24h" };

describe("unit formatting", () => {
  it("converts temperature", () => {
    expect(formatTemp(22.2, DEFAULT_UNITS)).toBe("72°");
    expect(formatTemp(22.2, metric)).toBe("22°");
  });
  it("converts speed", () => {
    expect(formatSpeed(10, DEFAULT_UNITS)).toBe("22 mph");
    expect(formatSpeed(10, metric)).toBe("36 km/h");
    expect(formatSpeed(10, { ...metric, speed: "ms" })).toBe("10 m/s");
  });
  it("converts pressure and distance", () => {
    expect(formatPressure(1013, DEFAULT_UNITS)).toBe("29.91 inHg");
    expect(formatPressure(1013.4, metric)).toBe("1013 hPa");
    expect(formatDistance(10000, DEFAULT_UNITS)).toBe("6.2 mi");
    expect(formatDistance(10000, metric)).toBe("10.0 km");
  });
  it("formats by metric key", () => {
    expect(formatMetric("precipChance", 0.4, DEFAULT_UNITS)).toBe("40%");
    expect(formatMetric("humidity", 85, DEFAULT_UNITS)).toBe("85%");
    expect(formatMetric("windDeg", 118, DEFAULT_UNITS)).toBe("SE");
    expect(formatMetric("windGust", null, DEFAULT_UNITS)).toBe("--");
  });
});
