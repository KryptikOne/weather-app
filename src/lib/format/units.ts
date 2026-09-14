export type Units = {
  temp: "F" | "C";
  speed: "mph" | "kmh" | "ms";
  pressure: "hPa" | "inHg";
  distance: "mi" | "km";
  time: "12h" | "24h";
};

export const DEFAULT_UNITS: Units = { temp: "F", speed: "mph", pressure: "inHg", distance: "mi", time: "12h" };

export const cToF = (c: number) => (c * 9) / 5 + 32;

export function formatTemp(c: number, units: Units): string {
  const v = units.temp === "F" ? cToF(c) : c;
  return `${Math.round(v)}°`;
}

export function formatSpeed(ms: number, units: Units): string {
  if (units.speed === "mph") return `${Math.round(ms * 2.23694)} mph`;
  if (units.speed === "kmh") return `${Math.round(ms * 3.6)} km/h`;
  return `${Math.round(ms)} m/s`;
}

export function formatPressure(hPa: number, units: Units): string {
  return units.pressure === "inHg" ? `${(hPa * 0.02953).toFixed(2)} inHg` : `${Math.round(hPa)} hPa`;
}

export function formatDistance(m: number, units: Units): string {
  return units.distance === "mi" ? `${(m / 1609.344).toFixed(1)} mi` : `${(m / 1000).toFixed(1)} km`;
}

export const formatPercent = (v: number) => `${Math.round(v)}%`;
export const formatFraction = (f: number) => `${Math.round(f * 100)}%`;
