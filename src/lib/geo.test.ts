import { describe, expect, it } from "vitest";
import { haversineKm, parseCoords, roundCoord } from "./geo";

describe("geo", () => {
  it("measures Chicago to Downers Grove at about 33 km", () => {
    const km = haversineKm({ lat: 41.8818, lon: -87.6232 }, { lat: 41.809, lon: -88.011 });
    expect(Math.abs(km - 33)).toBeLessThan(2);
  });
  it("rounds to three decimals", () => {
    expect(roundCoord(41.80949)).toBe(41.809);
    expect(roundCoord(-88.0114999)).toBe(-88.011);
  });
  it("parses and validates coordinates", () => {
    expect(parseCoords(new URLSearchParams("lat=41.80949&lon=-88.011"))).toEqual({ lat: 41.809, lon: -88.011 });
    expect(parseCoords(new URLSearchParams("lat=91&lon=0"))).toBeNull();
    expect(parseCoords(new URLSearchParams("lat=abc&lon=0"))).toBeNull();
    expect(parseCoords(new URLSearchParams(""))).toBeNull();
  });
});
