import { describe, expect, it } from "vitest";
import { DEFAULT_STATE } from "@/config/defaults";
import { loadState, sanitizeLayout, type Catalog } from "./persist";

const catalog: Catalog = {
  current: { defaultOptions: { showIcon: true, metrics: ["feelsLike"] } },
  sun: { defaultOptions: { showTwilight: true } },
};

describe("sanitizeLayout", () => {
  it("drops unknown types and malformed entries, fills missing options", () => {
    const out = sanitizeLayout(
      [
        { id: "a", type: "current", options: { showIcon: false } },
        { id: "b", type: "hourly", options: {} },
        { id: "c", type: "sun" },
        "junk",
        { type: "sun" },
      ],
      catalog,
    );
    expect(out.map((c) => c.id)).toEqual(["a", "c"]);
    expect(out[0].options).toEqual({ showIcon: false, metrics: ["feelsLike"] });
    expect(out[1].options).toEqual({ showTwilight: true });
  });
});

describe("loadState", () => {
  it("returns defaults for empty, corrupt, or mismatched versions", () => {
    expect(loadState(null, DEFAULT_STATE, catalog)).toBe(DEFAULT_STATE);
    expect(loadState("{not json", DEFAULT_STATE, catalog)).toBe(DEFAULT_STATE);
    expect(loadState(JSON.stringify({ version: 0 }), DEFAULT_STATE, catalog)).toBe(DEFAULT_STATE);
  });

  it("merges units and keeps locations", () => {
    const raw = JSON.stringify({
      version: 1,
      layouts: { phone: [{ id: "a", type: "sun", options: {} }], desktop: [] },
      units: { temp: "C" },
      locations: { saved: [{ id: "x", name: "Tokyo", country: "JP", lat: 35.6, lon: 139.7 }], active: "x" },
    });
    const s = loadState(raw, DEFAULT_STATE, catalog);
    expect(s.units).toEqual({ ...DEFAULT_STATE.units, temp: "C" });
    expect(s.layouts.phone[0].options).toEqual({ showTwilight: true });
    expect(s.layouts.desktop).toEqual([]);
    expect(s.locations.active).toBe("x");
    expect(s.locations.saved[0].name).toBe("Tokyo");
    expect(s.locations.lastKnown).toBeUndefined();
  });
});
