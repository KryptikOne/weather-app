import { getMoonIllumination, getMoonTimes } from "suncalc";
import type { MoonData, MoonPhaseName, PrincipalPhase } from "./types";

export function phaseName(phase: number): MoonPhaseName {
  const p = ((phase % 1) + 1) % 1;
  const eps = 0.02;
  if (p < eps || p > 1 - eps) return "New Moon";
  if (Math.abs(p - 0.25) < eps) return "First Quarter";
  if (Math.abs(p - 0.5) < eps) return "Full Moon";
  if (Math.abs(p - 0.75) < eps) return "Last Quarter";
  if (p < 0.25) return "Waxing Crescent";
  if (p < 0.5) return "Waxing Gibbous";
  if (p < 0.75) return "Waning Gibbous";
  return "Waning Crescent";
}

const TARGETS: { name: PrincipalPhase; value: number }[] = [
  { name: "New Moon", value: 0 },
  { name: "First Quarter", value: 0.25 },
  { name: "Full Moon", value: 0.5 },
  { name: "Last Quarter", value: 0.75 },
];

export function nextPrincipalPhases(from: Date, count = 4): { name: PrincipalPhase; date: Date }[] {
  const out: { name: PrincipalPhase; date: Date }[] = [];
  const step = 60 * 60 * 1000;
  const limit = from.getTime() + 40 * 24 * step;
  let prev = getMoonIllumination(from).phase;
  let t = from.getTime();
  while (out.length < count && t < limit) {
    t += step;
    const cur = getMoonIllumination(new Date(t)).phase;
    for (const target of TARGETS) {
      const crossed = target.value === 0 ? prev > 0.9 && cur < 0.1 : prev < target.value && cur >= target.value;
      if (crossed && !out.some((o) => o.name === target.name)) out.push({ name: target.name, date: new Date(t) });
    }
    prev = cur;
  }
  return out.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, count);
}

export function getMoonData(now: Date, lat: number, lon: number): MoonData {
  const ill = getMoonIllumination(now);
  const times = getMoonTimes(now, lat, lon);
  return {
    phase: ill.phase,
    illumination: ill.fraction,
    phaseName: phaseName(ill.phase),
    rise: times.rise ?? null,
    set: times.set ?? null,
    next: nextPrincipalPhases(now),
  };
}
