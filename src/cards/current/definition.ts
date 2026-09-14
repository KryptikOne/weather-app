import { Thermometer } from "lucide-react";
import { defineCard } from "@/cards/types";
import { METRIC_LIST } from "@/lib/metrics";
import { CurrentCard } from "./CurrentCard";

export type CurrentOptions = { metrics: string[]; showIcon: boolean };

const DEFAULT_METRICS = ["feelsLike", "humidity", "windSpeed", "uvi"];
const metricOptions = METRIC_LIST.filter((m) => m.fromCurrent).map((m) => ({ value: m.key, label: m.label }));

export const currentCard = defineCard<CurrentOptions>({
  type: "current",
  title: "Current Conditions",
  icon: Thermometer,
  component: CurrentCard,
  defaultOptions: { metrics: DEFAULT_METRICS, showIcon: true },
  fields: [
    { kind: "ordered-multi", key: "metrics", label: "Metrics", options: metricOptions, default: DEFAULT_METRICS, min: 1 },
    { kind: "toggle", key: "showIcon", label: "Show condition icon", default: true },
  ],
  breakpoints: ["phone", "desktop"],
  defaultSpan: { cols: 4, rows: 1 },
  minCols: 3,
  needs: ["weather"],
});
