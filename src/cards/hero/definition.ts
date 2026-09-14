import { Sun } from "lucide-react";
import { defineCard } from "@/cards/types";
import { HeroCard } from "./HeroCard";

export type HeroOptions = { showFeelsLike: boolean; showConditionText: boolean };

export const heroCard = defineCard<HeroOptions>({
  type: "hero",
  title: "Now",
  icon: Sun,
  component: HeroCard,
  defaultOptions: { showFeelsLike: true, showConditionText: true },
  fields: [
    { kind: "toggle", key: "showFeelsLike", label: "Show feels-like", default: true },
    { kind: "toggle", key: "showConditionText", label: "Show condition text", default: true },
  ],
  breakpoints: ["desktop"],
  defaultSpan: { cols: 12, rows: 1 },
  minCols: 6,
  needs: ["weather"],
});
