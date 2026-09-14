// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import type { WeatherProvider } from "@/lib/weather/provider";
import { handleWeather } from "./weather";

const snapshot = { fetchedAt: "x", hourly: [] } as unknown as Awaited<ReturnType<WeatherProvider["fetchSnapshot"]>>;

describe("handleWeather", () => {
  it("rejects bad coordinates", async () => {
    const provider: WeatherProvider = { id: "t", fetchSnapshot: vi.fn() };
    const res = await handleWeather(new URLSearchParams("lat=x&lon=0"), provider);
    expect(res.status).toBe(400);
  });

  it("rounds coordinates before calling the provider", async () => {
    const fetchSnapshot = vi.fn(async () => snapshot);
    const res = await handleWeather(new URLSearchParams("lat=41.80949&lon=-88.0114"), { id: "t", fetchSnapshot });
    expect(res.status).toBe(200);
    expect(fetchSnapshot).toHaveBeenCalledWith(41.809, -88.011);
    expect(await res.json()).toEqual(snapshot);
  });

  it("returns 502 without leaking upstream details", async () => {
    const fetchSnapshot = vi.fn(async () => { throw new Error("onecall 401 appid=secret"); });
    const res = await handleWeather(new URLSearchParams("lat=1&lon=2"), { id: "t", fetchSnapshot });
    expect(res.status).toBe(502);
    expect(await res.text()).toBe(JSON.stringify({ error: "upstream" }));
  });
});
