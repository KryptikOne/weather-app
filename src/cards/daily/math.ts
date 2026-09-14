import { scaleLinear } from "d3-scale";
import type { DailyPoint } from "@/lib/weather/types";

export type TempScale = { min: number; max: number };

/** Shared scale across the visible days so bars shift left and right through the week. */
export function dailyScale(days: DailyPoint[]): TempScale {
  const min = Math.min(...days.map((d) => d.tempMin));
  const max = Math.max(...days.map((d) => d.tempMax));
  return max > min ? { min, max } : { min: min - 1, max: max + 1 };
}

const pct = (scale: TempScale) => scaleLinear().domain([scale.min, scale.max]).range([0, 100]).clamp(true);

export function rangeBar(day: DailyPoint, scale: TempScale): { left: number; width: number } {
  const x = pct(scale);
  const left = x(day.tempMin);
  return { left, width: Math.max(2, x(day.tempMax) - left) };
}

export const markerPosition = (temp: number, scale: TempScale): number => pct(scale)(temp);
