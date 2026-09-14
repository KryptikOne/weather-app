import { describe, expect, it, vi } from "vitest";
import air from "./fixtures/air.json";
import onecall from "./fixtures/onecall.json";
import { createOpenWeatherProvider, mapOneCall, type AirResponse, type OneCallResponse } from "./openweather";

const oc = onecall as unknown as OneCallResponse;
const airRes = air as unknown as AirResponse;

describe("mapOneCall", () => {
  const snap = mapOneCall(oc, airRes, new Date("2026-09-13T12:00:00Z"));

  it("keeps 48 hourly and 8 daily points with ISO times", () => {
    expect(snap.hourly).toHaveLength(48);
    expect(snap.daily).toHaveLength(8);
    expect(new Date(snap.hourly[0].time).toISOString()).toBe(snap.hourly[0].time);
    expect(snap.fetchedAt).toBe("2026-09-13T12:00:00.000Z");
  });

  it("carries the timezone and coordinates", () => {
    expect(snap.location.timezone).toBe(oc.timezone);
    expect(snap.location.lat).toBe(oc.lat);
  });

  it("maps air quality and tolerates its absence", () => {
    expect(snap.air?.aqi).toBeGreaterThanOrEqual(1);
    expect(mapOneCall(oc, null).air).toBeNull();
  });

  it("sums rain and snow into precipAmount", () => {
    const h = { ...oc.hourly[0], rain: { "1h": 1.5 }, snow: { "1h": 0.5 } };
    const out = mapOneCall({ ...oc, hourly: [h] }, null);
    expect(out.hourly[0].precipAmount).toBe(2);
  });
});

describe("createOpenWeatherProvider", () => {
  it("requests metric units and throws on a failed One Call", async () => {
    const calls: string[] = [];
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      calls.push(String(input));
      return new Response("{}", { status: 500 });
    }) as unknown as typeof fetch;
    const provider = createOpenWeatherProvider("k", fetchImpl);
    await expect(provider.fetchSnapshot(1, 2)).rejects.toThrow("onecall 500");
    expect(calls.some((u) => u.includes("units=metric") && u.includes("appid=k"))).toBe(true);
  });
});
