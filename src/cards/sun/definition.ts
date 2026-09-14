import { Sun } from "lucide-react";
import { defineCard } from "@/cards/types";
import { SunCard } from "./SunCard";

export type SunOptions = { showTwilight: boolean; showSolarNoon: boolean; showVisibleSun: boolean };

export const sunCard = defineCard<SunOptions>({
  type: "sun",
  title: "Sun",
  icon: Sun,
  component: SunCard,
  defaultOptions: { showTwilight: true, showSolarNoon: true, showVisibleSun: true },
  fields: [
    { kind: "toggle", key: "showTwilight", label: "Show first and last light", default: true },
    { kind: "toggle", key: "showSolarNoon", label: "Show solar noon", default: true },
    { kind: "toggle", key: "showVisibleSun", label: "Show visible sun (sunrise to sunset)", default: true },
  ],
  breakpoints: ["phone", "desktop"],
  defaultSpan: { cols: 4, rows: 1 },
  minCols: 3,
  needs: ["astro"],
});
