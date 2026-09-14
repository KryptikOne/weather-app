import { CloudRain } from "lucide-react";
import { defineCard } from "@/cards/types";
import { isDry } from "./math";
import { PrecipCard } from "./PrecipCard";

export type PrecipOptions = { hideWhenDry: boolean };

export const precipCard = defineCard<PrecipOptions>({
  type: "precip-next-hour",
  title: "Next Hour",
  icon: CloudRain,
  component: PrecipCard,
  defaultOptions: { hideWhenDry: false },
  fields: [{ kind: "toggle", key: "hideWhenDry", label: "Hide when nothing is expected", default: false }],
  breakpoints: ["phone", "desktop"],
  defaultSpan: { cols: 4, rows: 1 },
  minCols: 3,
  needs: ["weather"],
  isHidden: (p) => p.options.hideWhenDry && Boolean(p.snapshot) && isDry(p.snapshot!.minutely),
});
