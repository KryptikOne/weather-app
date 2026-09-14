import { describe, expect, it } from "vitest";
import { DEFAULT_STATE } from "@/config/defaults";
import { reduce } from "./reducer";

const tokyo = { id: "x", name: "Tokyo", country: "JP", lat: 35.6, lon: 139.7 };

describe("reduce", () => {
  it("replaces a layout for one breakpoint only", () => {
    const s = reduce(DEFAULT_STATE, { type: "replaceLayout", breakpoint: "phone", cards: [] });
    expect(s.layouts.phone).toEqual([]);
    expect(s.layouts.desktop).toBe(DEFAULT_STATE.layouts.desktop);
  });

  it("merges units", () => {
    expect(reduce(DEFAULT_STATE, { type: "setUnits", units: { temp: "C" } }).units.temp).toBe("C");
  });

  it("adds a saved location once and activates on request", () => {
    let s = reduce(DEFAULT_STATE, { type: "addSavedLocation", location: tokyo });
    s = reduce(s, { type: "addSavedLocation", location: tokyo });
    expect(s.locations.saved).toHaveLength(1);
    s = reduce(s, { type: "setActiveLocation", active: "x" });
    expect(s.locations.active).toBe("x");
  });

  it("falls back to current when the active location is removed", () => {
    let s = reduce(DEFAULT_STATE, { type: "addSavedLocation", location: tokyo });
    s = reduce(s, { type: "setActiveLocation", active: "x" });
    s = reduce(s, { type: "removeSavedLocation", id: "x" });
    expect(s.locations.saved).toEqual([]);
    expect(s.locations.active).toBe("current");
  });

  it("records last known coordinates and hydrates wholesale", () => {
    const lk = { lat: 1, lon: 2, at: "2026-09-14T00:00:00Z" };
    expect(reduce(DEFAULT_STATE, { type: "setLastKnown", lastKnown: lk }).locations.lastKnown).toEqual(lk);
    const other = { ...DEFAULT_STATE, units: { ...DEFAULT_STATE.units, time: "24h" as const } };
    expect(reduce(DEFAULT_STATE, { type: "hydrate", state: other })).toBe(other);
  });

  it("moves a saved location up or down and clamps at the ends", () => {
    const denver = { id: "d", name: "Denver", country: "US", lat: 39.7, lon: -104.9 };
    let s = reduce(DEFAULT_STATE, { type: "addSavedLocation", location: tokyo });
    s = reduce(s, { type: "addSavedLocation", location: denver });
    expect(reduce(s, { type: "moveSavedLocation", id: "d", direction: -1 }).locations.saved.map((l) => l.id)).toEqual(["d", "x"]);
    expect(reduce(s, { type: "moveSavedLocation", id: "x", direction: -1 })).toBe(s);
    expect(reduce(s, { type: "moveSavedLocation", id: "d", direction: 1 })).toBe(s);
  });
});
