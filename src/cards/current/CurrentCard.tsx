"use client";
import { Thermometer } from "lucide-react";
import { CardFrame } from "@/cards/CardFrame";
import type { CardProps } from "@/cards/types";
import { WeatherIcon } from "@/components/icons/WeatherIcon";
import { formatTemp } from "@/lib/format/units";
import { tempColor } from "@/lib/theme/tempColor";
import { cn } from "@/lib/utils";
import type { CurrentOptions } from "./definition";
import { currentChips } from "./math";

export function CurrentCard({ options, snapshot, units, status, breakpoint }: CardProps<CurrentOptions>) {
  const current = snapshot?.current;
  return (
    <CardFrame title="Current Conditions" icon={Thermometer} status={current ? status : "loading"}>
      {current && (
        <div className={cn("flex flex-col gap-4", breakpoint === "desktop" && "gap-5")}>
          <div className="flex items-center gap-4">
            {options.showIcon && <WeatherIcon condition={current.condition} size={breakpoint === "desktop" ? 72 : 56} />}
            <div>
              <div data-testid="current-temp" className="text-5xl font-black leading-none" style={{ color: tempColor(current.temp) }}>
                {formatTemp(current.temp, units)}
              </div>
              <div className="mt-1 text-sm font-semibold text-muted-foreground">{current.condition.label}</div>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {currentChips(current, options.metrics, units).map((chip) => (
              <li key={chip.key} className="rounded-lg bg-secondary px-3 py-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{chip.label}</div>
                <div className="text-base font-extrabold">{chip.value}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </CardFrame>
  );
}
