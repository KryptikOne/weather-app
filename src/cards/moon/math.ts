import type { PrincipalPhase } from "@/lib/astro";

export const PRINCIPAL_PHASE_VALUE: Record<PrincipalPhase, number> = {
  "New Moon": 0,
  "First Quarter": 0.25,
  "Full Moon": 0.5,
  "Last Quarter": 0.75,
};

/**
 * SVG path of the lit part of a moon disc centered at (0,0), radius r, for phase 0..1
 * (0 new, 0.25 first quarter, 0.5 full, 0.75 last quarter). Northern-hemisphere orientation:
 * waxing lights the right side. The terminator is a half-ellipse with x-radius r*|cos(2*pi*phase)|.
 */
export function moonLitPath(phase: number, r: number): string {
  const p = ((phase % 1) + 1) % 1;
  const waxing = p <= 0.5;
  const k = Math.cos(2 * Math.PI * p);            // 1 new, 0 quarters, -1 full
  const rx = Math.round(Math.abs(k) * r * 1000) / 1000;   // rounded so quarters give exactly 0, not 3e-15
  const outerSweep = waxing ? 1 : 0;              // sweep=1 passes through the right side (y-down coordinates)
  const terminatorSweep = k > 0 ? (waxing ? 0 : 1) : (waxing ? 1 : 0);
  return `M 0 ${-r} A ${r} ${r} 0 0 ${outerSweep} 0 ${r} A ${rx} ${r} 0 0 ${terminatorSweep} 0 ${-r} Z`;
}
