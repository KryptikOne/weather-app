import { describe, expect, it } from "vitest";
import { DEFAULT_DESKTOP_LAYOUT, DEFAULT_PHONE_LAYOUT } from "@/config/defaults";
import { CATALOG, REGISTRY } from "./registry";

describe("registry", () => {
  it("registers every card the default layouts reference", () => {
    for (const c of [...DEFAULT_PHONE_LAYOUT, ...DEFAULT_DESKTOP_LAYOUT]) {
      expect(REGISTRY[c.type], c.type).toBeDefined();
    }
    expect(Object.keys(REGISTRY)).toHaveLength(10);
  });

  it("keeps each default layout to cards that support that breakpoint", () => {
    for (const c of DEFAULT_PHONE_LAYOUT) expect(REGISTRY[c.type].breakpoints, c.type).toContain("phone");
    for (const c of DEFAULT_DESKTOP_LAYOUT) expect(REGISTRY[c.type].breakpoints, c.type).toContain("desktop");
  });

  it("uses a span inside every desktop default card's limits", () => {
    for (const c of DEFAULT_DESKTOP_LAYOUT) {
      const def = REGISTRY[c.type];
      expect(c.span, c.type).toBeDefined();
      expect(c.span!.cols, c.type).toBeGreaterThanOrEqual(def.minCols);
      expect(c.span!.cols, c.type).toBeLessThanOrEqual(12);
      expect(c.span!.rows, c.type).toBeGreaterThanOrEqual(1);
      expect(c.span!.rows, c.type).toBeLessThanOrEqual(3);
    }
    for (const def of Object.values(REGISTRY)) {
      expect(def.defaultSpan.cols, def.type).toBeGreaterThanOrEqual(def.minCols);
      expect(def.minCols, def.type).toBeGreaterThanOrEqual(1);
    }
  });

  it("mirrors the registry in the catalog", () => {
    expect(Object.keys(CATALOG).sort()).toEqual(Object.keys(REGISTRY).sort());
  });

  it("gives every option field a default that matches defaultOptions", () => {
    for (const def of Object.values(REGISTRY)) {
      for (const f of def.fields) {
        expect(def.defaultOptions[f.key], `${def.type}.${f.key}`).toEqual(f.default);
      }
    }
  });
});
