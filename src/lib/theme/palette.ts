import { scaleLinear } from "d3-scale";
import type { ConditionGroup } from "@/lib/weather/types";

export type DayPhase = "night" | "dawn" | "day" | "dusk";
export type WeatherPalette = { skyTop: string; skyBottom: string; accent: string; accentForeground: string };

const HOUR = 60 * 60 * 1000;

export function dayPhase(now: Date, sun: { dawn: Date; sunrise: Date; sunset: Date; dusk: Date }): DayPhase {
  const t = now.getTime();
  if (t < sun.dawn.getTime() || t >= sun.dusk.getTime()) return "night";
  if (t < sun.sunrise.getTime() + HOUR) return "dawn";
  if (t >= sun.sunset.getTime() - HOUR) return "dusk";
  return "day";
}

const BASE: Record<DayPhase, WeatherPalette> = {
  night: { skyTop: "#0b1026", skyBottom: "#1a1f3d", accent: "#a06bff", accentForeground: "#ffffff" },
  dawn: { skyTop: "#2b1b4d", skyBottom: "#f28c5a", accent: "#ff9d6c", accentForeground: "#1a0f0a" },
  day: { skyTop: "#2f7ed8", skyBottom: "#8fc7ff", accent: "#4f8cff", accentForeground: "#ffffff" },
  dusk: { skyTop: "#1f1b4f", skyBottom: "#e2643f", accent: "#ff7a59", accentForeground: "#1a0f0a" },
};

const mix = (a: string, b: string, t: number) => scaleLinear<string>().domain([0, 1]).range([a, b])(t);

export function palette(phase: DayPhase, group: ConditionGroup): WeatherPalette {
  const base = BASE[phase];
  switch (group) {
    case "clouds":
      return { ...base, skyTop: mix(base.skyTop, "#6b7280", 0.35), skyBottom: mix(base.skyBottom, "#9ca3af", 0.35) };
    case "rain":
    case "drizzle":
      return { ...base, skyTop: mix(base.skyTop, "#334155", 0.55), skyBottom: mix(base.skyBottom, "#64748b", 0.55), accent: "#5aa9ff", accentForeground: "#ffffff" };
    case "snow":
      return { ...base, skyTop: mix(base.skyTop, "#94a3b8", 0.5), skyBottom: mix(base.skyBottom, "#e2e8f0", 0.5), accent: "#bfe3ff", accentForeground: "#0a0a0b" };
    case "thunder":
      return { ...base, skyTop: mix(base.skyTop, "#1e1b4b", 0.6), skyBottom: mix(base.skyBottom, "#312e81", 0.6), accent: "#fbbf24", accentForeground: "#1a1200" };
    case "fog":
      return { ...base, skyTop: mix(base.skyTop, "#9ca3af", 0.5), skyBottom: mix(base.skyBottom, "#d1d5db", 0.5) };
    default:
      return base;
  }
}
