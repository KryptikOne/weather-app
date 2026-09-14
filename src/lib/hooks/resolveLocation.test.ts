import { describe, expect, it } from "vitest";
import { resolveLocation } from "./resolveLocation";

const tokyo = { id: "x", name: "Tokyo", country: "JP", lat: 35.6, lon: 139.7 };
const tz = "America/Chicago";

describe("resolveLocation", () => {
  it("uses a saved location when active", () => {
    const r = resolveLocation({ saved: [tokyo], active: "x" }, tz);
    expect(r).toEqual({ kind: "saved", location: { name: "Tokyo", lat: 35.6, lon: 139.7, timezone: tz } });
  });
  it("uses last known coordinates for current", () => {
    const r = resolveLocation({ saved: [], active: "current", lastKnown: { lat: 1, lon: 2, name: "Here", at: "t" } }, tz);
    expect(r).toEqual({ kind: "current", location: { name: "Here", lat: 1, lon: 2, timezone: tz } });
  });
  it("labels an unnamed last known position", () => {
    const r = resolveLocation({ saved: [], active: "current", lastKnown: { lat: 1, lon: 2, at: "t" } }, tz);
    expect(r.location?.name).toBe("Current location");
  });
  it("needs geolocation when current has no last known", () => {
    expect(resolveLocation({ saved: [], active: "current" }, tz)).toEqual({ kind: "needs-geolocation", location: null });
  });
  it("falls back to current when the saved id is gone", () => {
    expect(resolveLocation({ saved: [], active: "missing" }, tz).kind).toBe("needs-geolocation");
  });
});
