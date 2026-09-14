import type { MinutePrecip } from "@/lib/weather/types";

export const isDry = (minutely: MinutePrecip[]) => minutely.every((m) => m.amount <= 0);

/** Bar heights in pixels for a strip of the given height; wet minutes never drop below 2px. */
export function precipBars(minutely: MinutePrecip[], height: number): { heights: number[]; max: number } {
  const max = Math.max(0.1, ...minutely.map((m) => m.amount));
  const heights = minutely.map((m) => (m.amount <= 0 ? 0 : Math.max(2, (m.amount / max) * height)));
  return { heights, max };
}
