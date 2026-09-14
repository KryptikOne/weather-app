import { describe, expect, it } from "vitest";
import { getSunData } from "./sun";

const LAT = 41.809, LON = -88.011;
const noonChicago = new Date("2026-09-13T17:00:00Z");
const minutesUtc = (d: Date) => d.getUTCHours() * 60 + d.getUTCMinutes();

describe("getSunData", () => {
  const sun = getSunData(noonChicago, LAT, LON);

  it("finds sunrise near 11:31 UTC and sunset near 00:07 UTC", () => {
    expect(Math.abs(minutesUtc(sun.sunrise) - (11 * 60 + 31))).toBeLessThanOrEqual(4);
    expect(Math.abs(minutesUtc(sun.sunset) - 7)).toBeLessThanOrEqual(4);
  });

  it("reports about 12 h 36 m of sun up (sunrise to sunset)", () => {
    expect(Math.abs(sun.sunUpMinutes - 756)).toBeLessThanOrEqual(4);
  });

  it("reports about 13 h 31 m of daylight (first to last light)", () => {
    expect(Math.abs(sun.daylightMinutes - 811)).toBeLessThanOrEqual(6);
    expect(sun.daylightMinutes).toBeGreaterThan(sun.sunUpMinutes);
  });

  it("puts dawn before sunrise and dusk after sunset", () => {
    expect(sun.dawn.getTime()).toBeLessThan(sun.sunrise.getTime());
    expect(sun.dusk.getTime()).toBeGreaterThan(sun.sunset.getTime());
  });
});
