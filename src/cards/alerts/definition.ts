import { TriangleAlert } from "lucide-react";
import { defineCard } from "@/cards/types";
import { AlertsCard } from "./AlertsCard";

export type AlertsOptions = { alwaysShow: boolean };

export const alertsCard = defineCard<AlertsOptions>({
  type: "alerts",
  title: "Alerts",
  icon: TriangleAlert,
  component: AlertsCard,
  defaultOptions: { alwaysShow: false },
  fields: [{ kind: "toggle", key: "alwaysShow", label: "Show even when there are no alerts", default: false }],
  breakpoints: ["phone", "desktop"],
  defaultSpan: { cols: 12, rows: 1 },
  minCols: 3,
  needs: ["weather"],
  isHidden: (p) => !p.options.alwaysShow && (!p.snapshot || p.snapshot.alerts.length === 0),
});
