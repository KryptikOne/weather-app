import type { Condition } from "@/lib/weather/types";
import { cn } from "@/lib/utils";
import { iconFor } from "./iconFor";

export function WeatherIcon({ condition, size = 48, className }: { condition: Condition; size?: number; className?: string }) {
  return (
    // Plain <img> on purpose: the SMIL animation inside these SVGs only runs when loaded as an image, not through next/image.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/icons/weather/${iconFor(condition)}.svg`}
      alt={condition.label}
      width={size}
      height={size}
      className={cn("inline-block select-none", className)}
      draggable={false}
    />
  );
}
