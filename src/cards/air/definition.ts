import { Wind } from "lucide-react";
import { defineCard } from "@/cards/types";
import { AirCard } from "./AirCard";

export type AirOptions = { showComponents: boolean };

export const airCard = defineCard<AirOptions>({
  type: "air-quality",
  title: "Air Quality",
  icon: Wind,
  component: AirCard,
  defaultOptions: { showComponents: false },
  fields: [{ kind: "toggle", key: "showComponents", label: "Show pollutant breakdown (µg/m³)", default: false }],
  breakpoints: ["phone", "desktop"],
  defaultSpan: { cols: 4, rows: 1 },
  minCols: 3,
  needs: ["air"],
});
