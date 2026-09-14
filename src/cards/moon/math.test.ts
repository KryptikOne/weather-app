import { describe, expect, it } from "vitest";
import { moonLitPath, PRINCIPAL_PHASE_VALUE } from "./math";

/** Pull every arc command: [rx, ry, sweep]. */
const arcs = (d: string) => [...d.matchAll(/A ([\d.]+) ([\d.]+) 0 0 ([01])/g)].map((m) => [Number(m[1]), Number(m[2]), Number(m[3])]);

describe("moonLitPath", () => {
  it("lights the right side while waxing and the left while waning", () => {
    expect(arcs(moonLitPath(0.1, 50))[0][2]).toBe(1);   // outer arc sweeps through the right
    expect(arcs(moonLitPath(0.9, 50))[0][2]).toBe(0);   // outer arc sweeps through the left
  });
  it("uses a straight terminator at the quarters and a full-radius one at full", () => {
    expect(arcs(moonLitPath(0.25, 50))[1][0]).toBeCloseTo(0, 5);
    expect(arcs(moonLitPath(0.75, 50))[1][0]).toBeCloseTo(0, 5);
    expect(arcs(moonLitPath(0.5, 50))[1][0]).toBeCloseTo(50, 5);
  });
  it("bulges the terminator toward the lit side for a crescent and away for a gibbous", () => {
    expect(arcs(moonLitPath(0.1, 50))[1][2]).toBe(0);   // waxing crescent: terminator also on the right
    expect(arcs(moonLitPath(0.4, 50))[1][2]).toBe(1);   // waxing gibbous: terminator on the left
    expect(arcs(moonLitPath(0.9, 50))[1][2]).toBe(1);   // waning crescent: terminator on the left
    expect(arcs(moonLitPath(0.6, 50))[1][2]).toBe(0);   // waning gibbous: terminator on the right
  });
  it("maps principal phases to their fraction", () => {
    expect(PRINCIPAL_PHASE_VALUE["Full Moon"]).toBe(0.5);
    expect(PRINCIPAL_PHASE_VALUE["New Moon"]).toBe(0);
  });
});
