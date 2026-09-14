import { getTimes } from "suncalc";
import type { SunData } from "./types";

/** suncalc reports null for events that don't happen (polar day or night); fall back to the nearest defined moment. */
export function getSunData(now: Date, lat: number, lon: number): SunData {
  const t = getTimes(now, lat, lon);
  const solarNoon = t.solarNoon ?? now;
  const sunrise = t.sunrise ?? solarNoon;
  const sunset = t.sunset ?? solarNoon;
  const dawn = t.dawn ?? sunrise;
  const dusk = t.dusk ?? sunset;
  return {
    sunrise,
    sunset,
    solarNoon,
    dawn,
    dusk,
    daylightMinutes: Math.round((dusk.getTime() - dawn.getTime()) / 60000),
    sunUpMinutes: Math.round((sunset.getTime() - sunrise.getTime()) / 60000),
  };
}
