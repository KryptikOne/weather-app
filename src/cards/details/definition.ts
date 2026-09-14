import { LayoutGrid } from "lucide-react";
import { defineCard } from "@/cards/types";
import { METRIC_LIST } from "@/lib/metrics";
import { DetailsCard } from "./DetailsCard";

export type DetailsOptions = { metrics: string[] };

const DEFAULT_METRICS = ["windSpeed", "windGust", "humidity", "dewPoint", "pressure", "uvi", "visibility", "clouds"];
const metricOptions = METRIC_LIST.filter((m) => m.fromCurrent).map((m) => ({ value: m.key, label: m.label }));

export const detailsCard = defineCard<DetailsOptions>({
  type: "details",
  title: "Details",
  icon: LayoutGrid,
  component: DetailsCard,
  defaultOptions: { metrics: DEFAULT_METRICS },
  fields: [{ kind: "ordered-multi", key: "metrics", label: "Metrics", options: metricOptions, default: DEFAULT_METRICS, min: 1 }],
  breakpoints: ["phone", "desktop"],
  spans: [{ cols: 8, rows: 1 }, { cols: 4, rows: 1 }, { cols: 6, rows: 1 }],
  needs: ["weather"],
});
