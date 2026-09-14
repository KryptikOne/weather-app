import { Clock } from "lucide-react";
import { defineCard } from "@/cards/types";
import { METRIC_LIST } from "@/lib/metrics";
import { HourlyCard } from "./HourlyCard";

export type HourlyOptions = { metrics: string[]; defaultMetric: string; hours: "12" | "24" | "48" };

const DEFAULT_METRICS = ["temp", "feelsLike", "precipChance", "precipAmount", "windSpeed"];
const metricOptions = METRIC_LIST.filter((m) => m.fromHourly).map((m) => ({ value: m.key, label: m.label }));

export const hourlyCard = defineCard<HourlyOptions>({
  type: "hourly",
  title: "Hourly Forecast",
  icon: Clock,
  component: HourlyCard,
  defaultOptions: { metrics: DEFAULT_METRICS, defaultMetric: "temp", hours: "24" },
  fields: [
    { kind: "ordered-multi", key: "metrics", label: "Chips", options: metricOptions, default: DEFAULT_METRICS, min: 1 },
    { kind: "select", key: "defaultMetric", label: "Starts on", options: metricOptions, default: "temp" },
    { kind: "select", key: "hours", label: "Hours shown", options: [{ value: "12", label: "12" }, { value: "24", label: "24" }, { value: "48", label: "48" }], default: "24" },
  ],
  breakpoints: ["phone", "desktop"],
  defaultSpan: { cols: 8, rows: 1 },
  minCols: 4,
  needs: ["weather"],
});
