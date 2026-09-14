import { Moon } from "lucide-react";
import { defineCard } from "@/cards/types";
import { MoonCard } from "./MoonCard";

export type MoonOptions = { upcomingPhases: number; showRiseSet: boolean };

export const moonCard = defineCard<MoonOptions>({
  type: "moon",
  title: "Moon",
  icon: Moon,
  component: MoonCard,
  defaultOptions: { upcomingPhases: 4, showRiseSet: true },
  fields: [
    { kind: "number", key: "upcomingPhases", label: "Upcoming phases shown", min: 0, max: 4, step: 1, default: 4 },
    { kind: "toggle", key: "showRiseSet", label: "Show moonrise and moonset", default: true },
  ],
  breakpoints: ["phone", "desktop"],
  defaultSpan: { cols: 4, rows: 1 },
  minCols: 3,
  needs: ["astro"],
});
