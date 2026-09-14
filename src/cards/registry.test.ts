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

  it("uses a supported span for every desktop default", () => {
    for (const c of DEFAULT_DESKTOP_LAYOUT) {
      const ok = REGISTRY[c.type].spans.some((s) => s.cols === c.span?.cols && s.rows === c.span?.rows);
      expect(ok, `${c.type} ${JSON.stringify(c.span)}`).toBe(true);
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
