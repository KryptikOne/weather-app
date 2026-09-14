import { CalendarDays } from "lucide-react";
import { defineCard } from "@/cards/types";
import { DailyCard } from "./DailyCard";

export type DailyOptions = { days: "7" | "8"; showPrecipChance: boolean; showTodayMarker: boolean };

export const dailyCard = defineCard<DailyOptions>({
  type: "daily",
  title: "Daily Forecast",
  icon: CalendarDays,
  component: DailyCard,
  defaultOptions: { days: "7", showPrecipChance: true, showTodayMarker: true },
  fields: [
    { kind: "select", key: "days", label: "Days shown", options: [{ value: "7", label: "7" }, { value: "8", label: "8" }], default: "7" },
    { kind: "toggle", key: "showPrecipChance", label: "Show precipitation chance", default: true },
    { kind: "toggle", key: "showTodayMarker", label: "Mark current temperature on today", default: true },
  ],
  breakpoints: ["phone", "desktop"],
  defaultSpan: { cols: 4, rows: 2 },
  minCols: 3,
  needs: ["weather"],
});
