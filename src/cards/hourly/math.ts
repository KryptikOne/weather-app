import { scaleLinear } from "d3-scale";
import { curveMonotoneX, line } from "d3-shape";
import { cToF, type Units } from "@/lib/format/units";
import { METRICS, type MetricKey } from "@/lib/metrics";
import type { Condition, HourlyPoint } from "@/lib/weather/types";

export type SeriesPoint = { time: string; value: number | null; condition: Condition; windDeg: number };
export type Box = { width: number; height: number; top: number; bottom: number };

const BAR_METRICS = new Set<string>(["precipChance", "precipAmount"]);
export const isBarMetric = (key: string) => BAR_METRICS.has(key);

export function hourlySeries(hourly: HourlyPoint[], key: string, count: number): SeriesPoint[] {
  const metric = METRICS[key as MetricKey];
  return hourly.slice(0, count).map((h) => ({
    time: h.time,
    value: metric?.fromHourly ? metric.fromHourly(h) : null,
    condition: h.condition,
    windDeg: h.windDeg,
  }));
}

const columnCenter = (i: number, n: number, width: number) => ((i + 0.5) * width) / n;

export function curveLayout(values: (number | null)[], box: Box): { path: string; points: { x: number; y: number | null }[] } {
  const n = Math.max(1, values.length);
  const defined = values.filter((v): v is number => v != null);
  const lo = defined.length ? Math.min(...defined) : 0;
  const hi = defined.length ? Math.max(...defined) : 1;
  const pad = hi === lo ? 1 : (hi - lo) * 0.15;
  const y = scaleLinear().domain([lo - pad, hi + pad]).range([box.height - box.bottom, box.top]);
  const gen = line<number | null>()
    .defined((v) => v != null)
    .x((_, i) => columnCenter(i, n, box.width))
    .y((v) => y(v ?? 0))
    .curve(curveMonotoneX);
  return {
    path: gen(values) ?? "",
    points: values.map((v, i) => ({ x: columnCenter(i, n, box.width), y: v == null ? null : y(v) })),
  };
}

export function barLayout(values: (number | null)[], box: Box, domainMax?: number): { x: number; y: number; w: number; h: number }[] {
  const n = Math.max(1, values.length);
  const colW = box.width / n;
  const max = domainMax ?? Math.max(1, ...values.map((v) => v ?? 0));
  const inner = box.height - box.top - box.bottom;
  const h = scaleLinear().domain([0, max]).range([0, inner]);
  return values.map((v, i) => {
    const height = v == null ? 0 : h(v);
    return { x: i * colW + colW * 0.25, y: box.height - box.bottom - height, w: colW * 0.5, h: height };
  });
}

/** Compact value for the strip: units live in the chip label, not on every hour. */
export function formatStripValue(key: string, value: number | null, units: Units): string {
  if (value == null) return "";
  const unit = METRICS[key as MetricKey]?.unit;
  switch (unit) {
    case "temp": return `${Math.round(units.temp === "F" ? cToF(value) : value)}°`;
    case "fraction": return `${Math.round(value * 100)}%`;
    case "percent": return `${Math.round(value)}%`;
    case "mm": return value.toFixed(1);
    case "speed": {
      const v = units.speed === "mph" ? value * 2.23694 : units.speed === "kmh" ? value * 3.6 : value;
      return `${Math.round(v)}`;
    }
    case "index": return `${Math.round(value)}`;
    default: return `${Math.round(value)}`;
  }
}
