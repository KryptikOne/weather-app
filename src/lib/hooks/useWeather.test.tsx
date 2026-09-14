import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SWRConfig } from "swr";
import { useWeather } from "./useWeather";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{children}</SWRConfig>
);

describe("useWeather", () => {
  afterEach(() => vi.restoreAllMocks());

  it("is loading with no coords", () => {
    const { result } = renderHook(() => useWeather(null), { wrapper });
    expect(result.current.status).toBe("loading");
  });

  it("fetches the route with rounded coords and reports ready", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ fetchedAt: "t", hourly: [] }), { status: 200 }),
    );
    const { result } = renderHook(() => useWeather({ lat: 41.80949, lon: -88.0114 }), { wrapper });
    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(String(fetchMock.mock.calls[0][0])).toBe("/api/weather?lat=41.809&lon=-88.011");
    expect(result.current.snapshot?.fetchedAt).toBe("t");
  });

  it("reports error when the first fetch fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 502 }));
    const { result } = renderHook(() => useWeather({ lat: 1, lon: 2 }), { wrapper });
    await waitFor(() => expect(result.current.status).toBe("error"));
  });
});
