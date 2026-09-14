// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { handleGeocode } from "./geocode";

const owmHit = { name: "Downers Grove", state: "Illinois", country: "US", lat: 41.8089, lon: -88.0112 };
const mockFetch = (body: unknown, status = 200) =>
  vi.fn(async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;

describe("handleGeocode", () => {
  it("searches by name and maps results", async () => {
    const f = mockFetch([owmHit]);
    const res = await handleGeocode(new URLSearchParams("q=downers"), "k", f);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([{ name: "Downers Grove", region: "Illinois", country: "US", lat: 41.8089, lon: -88.0112 }]);
    expect(String((f as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0])).toContain("geo/1.0/direct?q=downers&limit=5");
  });

  it("reverse geocodes coordinates", async () => {
    const f = mockFetch([owmHit]);
    const res = await handleGeocode(new URLSearchParams("lat=41.809&lon=-88.011"), "k", f);
    expect((await res.json())[0].name).toBe("Downers Grove");
    expect(String((f as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0])).toContain("geo/1.0/reverse?lat=41.809&lon=-88.011&limit=1");
  });

  it("rejects missing input and hides upstream failures", async () => {
    expect((await handleGeocode(new URLSearchParams(""), "k", mockFetch([]))).status).toBe(400);
    const res = await handleGeocode(new URLSearchParams("q=x"), "k", mockFetch({ cod: 401 }, 401));
    expect(res.status).toBe(502);
    expect(await res.text()).toBe(JSON.stringify({ error: "upstream" }));
  });
});
