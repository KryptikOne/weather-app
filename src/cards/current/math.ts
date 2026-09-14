import type { Units } from "@/lib/format/units";
import { formatMetric, METRICS, type MetricKey } from "@/lib/metrics";
import type { CurrentConditions } from "@/lib/weather/types";

export type Chip = { key: MetricKey; label: string; value: string };

export function currentChips(current: CurrentConditions, keys: string[], units: Units): Chip[] {
  const out: Chip[] = [];
  for (const key of keys) {
    const metric = METRICS[key as MetricKey];
    if (!metric?.fromCurrent) continue;
    out.push({ key: metric.key, label: metric.label, value: formatMetric(metric.key, metric.fromCurrent(current), units) });
  }
  return out;
}
