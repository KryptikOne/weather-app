import { getMoonData } from "./moon";
import { getSunData } from "./sun";
import type { AstroData } from "./types";

export * from "./types";
export { getMoonData, getSunData };

export function getAstro(now: Date, lat: number, lon: number): AstroData {
  return { sun: getSunData(now, lat, lon), moon: getMoonData(now, lat, lon) };
}
