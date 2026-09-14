import { formatDistance, formatFraction, formatPercent, formatPressure, formatSpeed, formatTemp, type Units } from "@/lib/format/units";
import type { CurrentConditions, HourlyPoint } from "@/lib/weather/types";

export type UnitKind = "temp" | "percent" | "fraction" | "mm" | "speed" | "pressure" | "distance" | "index" | "degrees";

export type MetricKey =
  | "temp" | "feelsLike" | "precipChance" | "precipAmount" | "humidity" | "dewPoint"
  | "pressure" | "uvi" | "visibility" | "clouds" | "windSpeed" | "windGust" | "windDeg";

export type Metric = {
  key: MetricKey;
  label: string;
  shortLabel: string;
  unit: UnitKind;
  fromCurrent?: (c: CurrentConditions) => number | null;
  fromHourly?: (h: HourlyPoint) => number | null;
};

export const METRICS: Record<MetricKey, Metric> = {
  temp: { key: "temp", label: "Temperature", shortLabel: "Temp", unit: "temp", fromCurrent: (c) => c.temp, fromHourly: (h) => h.temp },
  feelsLike: { key: "feelsLike", label: "Feels Like", shortLabel: "Feels", unit: "temp", fromCurrent: (c) => c.feelsLike, fromHourly: (h) => h.feelsLike },
  precipChance: { key: "precipChance", label: "Precip Chance", shortLabel: "Chance", unit: "fraction", fromHourly: (h) => h.precipChance },
  precipAmount: { key: "precipAmount", label: "Precip Amount", shortLabel: "Precip", unit: "mm", fromHourly: (h) => h.precipAmount },
  humidity: { key: "humidity", label: "Humidity", shortLabel: "Humidity", unit: "percent", fromCurrent: (c) => c.humidity, fromHourly: (h) => h.humidity },
  dewPoint: { key: "dewPoint", label: "Dew Point", shortLabel: "Dew Pt", unit: "temp", fromCurrent: (c) => c.dewPoint },
  pressure: { key: "pressure", label: "Pressure", shortLabel: "Pressure", unit: "pressure", fromCurrent: (c) => c.pressure },
  uvi: { key: "uvi", label: "UV Index", shortLabel: "UV", unit: "index", fromCurrent: (c) => c.uvi, fromHourly: (h) => h.uvi },
  visibility: { key: "visibility", label: "Visibility", shortLabel: "Vis", unit: "distance", fromCurrent: (c) => c.visibility },
  clouds: { key: "clouds", label: "Cloud Cover", shortLabel: "Clouds", unit: "percent", fromCurrent: (c) => c.clouds, fromHourly: (h) => h.clouds },
  windSpeed: { key: "windSpeed", label: "Wind", shortLabel: "Wind", unit: "speed", fromCurrent: (c) => c.windSpeed, fromHourly: (h) => h.windSpeed },
  windGust: { key: "windGust", label: "Wind Gust", shortLabel: "Gust", unit: "speed", fromCurrent: (c) => c.windGust, fromHourly: (h) => h.windGust },
  windDeg: { key: "windDeg", label: "Wind Direction", shortLabel: "Dir", unit: "degrees", fromCurrent: (c) => c.windDeg, fromHourly: (h) => h.windDeg },
};

export const METRIC_LIST: Metric[] = Object.values(METRICS);

const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
export const compassLabel = (deg: number) => COMPASS[Math.round(deg / 45) % 8];

export function formatMetric(key: MetricKey, value: number | null, units: Units): string {
  if (value == null) return "--";
  switch (METRICS[key].unit) {
    case "temp": return formatTemp(value, units);
    case "percent": return formatPercent(value);
    case "fraction": return formatFraction(value);
    case "mm": return `${value.toFixed(1)} mm`;
    case "speed": return formatSpeed(value, units);
    case "pressure": return formatPressure(value, units);
    case "distance": return formatDistance(value, units);
    case "index": return `${Math.round(value)}`;
    case "degrees": return compassLabel(value);
  }
}
